const { default: axios } = require('axios')
const cheerio = require('cheerio');


const getPriceFeed = async (currency) => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: `https://www.google.com/search?q=${currency}`
    })

    const $ = cheerio.load(data)

    let price = ''
    $('[class="BNeawe iBp4i AP7Wnd"]').each((i, e) => {
      price = $(e).text()
    })
    console.log(price)


  } catch (error) {
    console.error(error.message)
  }
}

getPriceFeed('btc')
getPriceFeed('usd')

