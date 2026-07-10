function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    const snek = document.querySelector<HTMLDivElement>('#snek')!
    const counter = document.querySelector<HTMLHeadElement>('#boops')!

    let boops = 0

    function boop(): void {
      boops += 1
      counter.innerHTML = `${boops} BOOPS`
    }

    snek.onmousedown = (): void => {
      snek.style['font-size'] = '550%'
      boop()
    }

    snek.onmouseup = (): void => {
      snek.style['font-size'] = '500%'
    }
  })
}

init()
