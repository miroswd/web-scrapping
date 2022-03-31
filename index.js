const { default: axios } = require('axios')

const cheerio = require('cheerio')

const express = require('express')

async function getPriceFeed() {
  try {
    const siteUrl = 'https://coinmarketcap.com'
    const { data } = await axios({
      method: "GET",
      url: siteUrl
    })

    const $ = cheerio.load(data)
    const elemSelector = `#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr` // remove :nth-child(1) from tr

    const keys = [
      'rank', 'name', 'price', '24h', '7d', 'marketCap', 'volume', 'circulartingSupply'
    ]

    const coinArr = []

    $(elemSelector).each((parentIdx, parentElement) => {
      let keyIdx = 0;
      const coinObj = {}
      if (parentIdx <= 9) {
        $(parentElement).children().each((childIdx, childElement) => {
          let tdValue = $(childElement).text()

          if (keyIdx === 1 || keyIdx === 6) {

            tdValue = $('p:first-child', $(childElement).html()).text()

          }

          if (tdValue) {
            coinObj[keys[keyIdx]] = tdValue
            keyIdx++
          }
        })
        coinArr.push(coinObj)
      }
    })

    return coinArr
  } catch (error) {
    console.error(error)
  }
}

const app = express()

app.get('/api/price-feed', async (req, res) => {
  try {
    const priceFeed = await getPriceFeed();

    return res.status(200).json(priceFeed)
  } catch (error) {
    return res.status(500).json({
      err: error.message
    })
  }
})

app.listen(3000, () => {
  console.log('running on port 3000')
})