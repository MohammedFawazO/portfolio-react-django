import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1400, height: 900 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('#technology-stack', { timeout: 30000 })

const probe = async () =>
  page.evaluate(() => {
    const section = document.querySelector('#technology-stack')
    const card = [...section.querySelectorAll('div')].find((d) => d.classList.contains('group/card'))
    const icon = card.querySelector('img') || card.querySelector('span')
    const spans = card.querySelectorAll('span')
    const label = spans[spans.length - 1]
    const s = getComputedStyle(icon)
    return {
      name: icon.getAttribute('alt') || 'inline-svg',
      filter: s.filter,
      transition: `${s.transitionDuration} ${s.transitionProperty}`,
      labelColor: getComputedStyle(label).color,
      cardTransform: getComputedStyle(card).transform,
    }
  })

const before = await probe()

const cardHandle = await page.evaluateHandle(() => {
  const section = document.querySelector('#technology-stack')
  return [...section.querySelectorAll('div')].find((d) => d.classList.contains('group/card'))
})
await cardHandle.asElement().hover()
await new Promise((r) => setTimeout(r, 1000))
const after = await probe()

console.log(JSON.stringify({ before, after }, null, 2))

const greyBefore = /grayscale\(1/.test(before.filter)
const colorAfter = !/grayscale\(1/.test(after.filter)
const labelRecolored = after.labelColor !== before.labelColor
const rowNudged = after.cardTransform !== before.cardTransform
console.log(
  `RESULT: default grey = ${greyBefore}, hover restores color = ${colorAfter}, ` +
    `label recolored = ${labelRecolored}, row/card transform changed = ${rowNudged}`
)

await browser.close()
process.exit(greyBefore && colorAfter ? 0 : 1)