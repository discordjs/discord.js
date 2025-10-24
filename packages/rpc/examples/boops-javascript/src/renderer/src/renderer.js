function init() {
  window.addEventListener('DOMContentLoaded', () => {
    const snek = document.querySelector('#snek')
    const counter = document.querySelector('#boops')

    let boops = 0

    function boop() {
      boops += 1
      counter.innerHTML = `${boops} BOOPS`
    }

    snek.onmousedown = () => {
      snek.style['font-size'] = '550%'
      boop()
    }

    snek.onmouseup = () => {
      snek.style['font-size'] = '500%'
    }
  })
}

init()
