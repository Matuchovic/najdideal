'use client'
import { useEffect } from 'react'

const HL = [
  {l1:'NAKUP',l2:'LEVNĚJI.',l3:'PRODEJ',l4:'ZA VÍC.'},
  {l1:'PŘEPLÁCÍŠ.',l2:'PŘESTAŇ.',l3:'UŠETŘI',l4:'TISÍCE.'},
  {l1:'JINÍ TĚ',l2:'NECHAJÍ ČEKAT.',l3:'MY NE.',l4:''},
  {l1:'VĚTŠINA LIDÍ',l2:'TO PŘEHLÉDNE.',l3:'TY NE.',l4:''},
  {l1:'AI VIDÍ',l2:'CO TY NE.',l3:'VYUŽIJ TO.',l4:''},
  {l1:'CENA PRÁVĚ',l2:'KLESLA.',l3:'VĚDĚL JSI?',l4:''},
  {l1:'CHYTŘÍ LIDÉ',l2:'NAKUPUJÍ LEVNĚJI.',l3:'KAŽDÝ DEN.',l4:''},
  {l1:'NEJLEPŠÍ DEAL',l2:'MIZÍ ZA',l3:'3 MINUTY.',l4:''},
]

export default function HeadlineMorph() {
  useEffect(() => {
    let idx = 0
    function set(h: typeof HL[0]) {
      const el = document.getElementById('nd-h-inner')
      const l1 = document.getElementById('nd-l1')
      const l2 = document.getElementById('nd-l2')
      const l3 = document.getElementById('nd-l3')
      const l4 = document.getElementById('nd-l4')
      if (!el || !l1) return
      el.style.transform = 'translateX(100%) skewX(-8deg)'
      el.style.opacity = '0'
      setTimeout(() => {
        l1!.textContent = h.l1 || '\u00A0'
        l2!.textContent = h.l2 || '\u00A0'
        l3!.textContent = h.l3 || '\u00A0'
        l4!.textContent = h.l4 || '\u00A0'
        el.style.transform = 'translateX(-6%) skewX(4deg)'
        setTimeout(() => {
          el.style.transform = 'translateX(0) skewX(0deg)'
          el.style.opacity = '1'
        }, 50)
      }, 450)
    }
    set(HL[0])
    const id = setInterval(() => {
      idx = (idx + 1) % HL.length
      set(HL[idx])
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return null
}
