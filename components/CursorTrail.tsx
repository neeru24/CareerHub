"use client"

import { useEffect } from "react"

export default function CursorTrail() {
  useEffect(() => {
    const container = document.getElementById("cursor-trail")
    if (!container) return

    type TrailCircle = HTMLDivElement & { x: number; y: number }
    const NUM_CIRCLES = 15
    const circles: TrailCircle[] = []

    for (let i = 0; i < NUM_CIRCLES; i++) {
      const circle = document.createElement("div") as TrailCircle
      circle.className = "circle"
      if (i === NUM_CIRCLES - 1) circle.classList.add("glow")
      circle.style.opacity = String(1 - i / NUM_CIRCLES)

      circle.x = 0
      circle.y = 0

      container.appendChild(circle)
      circles.push(circle)
    }

    const coords = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      coords.x = e.clientX
      coords.y = e.clientY
    }

    window.addEventListener("mousemove", onMouseMove)

    const animate = () => {
      let x = coords.x
      let y = coords.y

      circles.forEach((circle, index) => {
        circle.style.left = `${x}px`
        circle.style.top = `${y}px`
        circle.style.transform = `translate(-50%, -50%) scale(${1 - index * 0.05})`

        const next = circles[index + 1] || circles[0]
        circle.x = x
        circle.y = y

        x += (next.x - x) * 0.3
        y += (next.y - y) * 0.3
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      container.innerHTML = ""
    }
  }, [])

  return <div id="cursor-trail" className="circle-container" />
}
