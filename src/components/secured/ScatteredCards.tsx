"use client";

import { useEffect, useRef, useState } from "react";

interface CardDef {
  name: string;
  bank: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  chipColor: string;
}

const CARDS: CardDef[] = [
  {
    name: "Infinia",
    bank: "HDFC",
    gradient: "linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 40%, #2a2a2a 100%)",
    textColor: "#c5a55a",
    accentColor: "#c5a55a",
    chipColor: "#c5a55a",
  },
  {
    name: "Platinum",
    bank: "AMEX",
    gradient: "linear-gradient(135deg, #8a8a8a 0%, #c0c0c0 30%, #a0a0a0 60%, #d0d0d0 100%)",
    textColor: "#1a1a1a",
    accentColor: "#2a5caa",
    chipColor: "#d4af37",
  },
  {
    name: "Elite",
    bank: "SBI",
    gradient: "linear-gradient(135deg, #0a1628 0%, #1a3a6a 50%, #0d2040 100%)",
    textColor: "#c5a55a",
    accentColor: "#c5a55a",
    chipColor: "#c5a55a",
  },
  {
    name: "Sapphiro",
    bank: "ICICI",
    gradient: "linear-gradient(135deg, #0a1a3a 0%, #1a3a7a 40%, #2a4a8a 100%)",
    textColor: "#e0e8f5",
    accentColor: "#6a9fd8",
    chipColor: "#d4af37",
  },
  {
    name: "Magnus",
    bank: "AXIS",
    gradient: "linear-gradient(135deg, #2a0a1a 0%, #5a1a2a 40%, #3a0a1a 100%)",
    textColor: "#d4af37",
    accentColor: "#d4af37",
    chipColor: "#d4af37",
  },
  {
    name: "Marquee",
    bank: "YES",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 50%, #1a1a2e 100%)",
    textColor: "#b0b0d0",
    accentColor: "#7a7aaa",
    chipColor: "#d4af37",
  },
  {
    name: "Wealth",
    bank: "IDFC",
    gradient: "linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 40%, #0a3a1a 100%)",
    textColor: "#c5dfc5",
    accentColor: "#4a8a5a",
    chipColor: "#d4af37",
  },
  {
    name: "Diners Black",
    bank: "HDFC",
    gradient: "linear-gradient(135deg, #1e1e1e 0%, #333333 40%, #1e1e1e 100%)",
    textColor: "#ffffff",
    accentColor: "#e0e0e0",
    chipColor: "#c5a55a",
  },
];

const CARD_W = 280;
const CARD_H = 175;

function buildCardHTML(card: CardDef): string {
  const dots = Array.from({ length: 3 }, () =>
    `<div style="display:flex;gap:3px">${Array.from({ length: 4 }, () =>
      `<div style="width:4px;height:4px;border-radius:2px;background:${card.textColor}40"></div>`
    ).join("")}</div>`
  ).join("");

  return `<div style="width:${CARD_W}px;height:${CARD_H}px;background:${card.gradient};border-radius:14px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 12px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.15);user-select:none;overflow:hidden;position:relative;font-family:var(--font-ui)">
    <div style="position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.05) 45%,transparent 50%);pointer-events:none"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative">
      <span style="font-size:13px;font-weight:700;letter-spacing:0.12em;color:${card.textColor}">${card.bank}</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px;position:relative">
      <div style="width:36px;height:26px;border-radius:5px;background:linear-gradient(135deg,${card.chipColor}60,${card.chipColor}30);border:1px solid ${card.chipColor}40"></div>
      <div style="display:flex;gap:10px">${dots}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${card.accentColor};opacity:0.7">${card.name}</span>
      <div style="display:flex">
        <div style="width:20px;height:20px;border-radius:10px;background:${card.accentColor}30"></div>
        <div style="width:20px;height:20px;border-radius:10px;background:${card.accentColor}20;margin-left:-8px"></div>
      </div>
    </div>
  </div>`;
}

export function ScatteredCards() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState("mounting...");

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) { setStatus("no scene ref"); return; }

    setStatus("loading matter-js...");
    let raf = 0;
    let cancelled = false;

    import("matter-js").then((mod) => {
      const Matter = (mod as any).default || mod;
      if (!Matter.Engine) { setStatus("Matter.Engine missing. Keys: " + Object.keys(Matter).join(",")); return; }
      setStatus("matter loaded, setting up physics...");
      if (cancelled || !scene) return;

      const w = scene.clientWidth;
      const h = scene.clientHeight;
      if (w === 0 || h === 0) return;

      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1, scale: 0.001 },
      });

      const wallOpts = { isStatic: true, restitution: 0.5, friction: 0.1 };
      Matter.Composite.add(engine.world, [
        Matter.Bodies.rectangle(w / 2, h + 30, w + 100, 60, wallOpts),
        Matter.Bodies.rectangle(w / 2, -30, w + 100, 60, wallOpts),
        Matter.Bodies.rectangle(-30, h / 2, 60, h + 100, wallOpts),
        Matter.Bodies.rectangle(w + 30, h / 2, 60, h + 100, wallOpts),
      ]);

      const cardEls: HTMLDivElement[] = [];

      const bodies = CARDS.map((card, i) => {
        const x = 100 + Math.random() * (w - 200);
        const y = -100 - i * 80 - Math.random() * 60;
        const angle = (Math.random() - 0.5) * 0.8;

        const body = Matter.Bodies.rectangle(x, y, CARD_W, CARD_H, {
          restitution: 0.3,
          friction: 0.4,
          frictionAir: 0.02,
          angle,
          chamfer: { radius: 14 },
        });

        Matter.Composite.add(engine.world, body);

        const el = document.createElement("div");
        el.style.cssText = `position:absolute;width:${CARD_W}px;height:${CARD_H}px;will-change:transform;z-index:${i};pointer-events:none;`;
        el.innerHTML = buildCardHTML(card);
        scene.appendChild(el);
        cardEls.push(el);

        return body;
      });

      const mouse = Matter.Mouse.create(scene);
      mouse.pixelRatio = window.devicePixelRatio || 1;

      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.6,
          damping: 0.1,
          render: { visible: false },
        },
      });

      Matter.Composite.add(engine.world, mouseConstraint);

      Matter.Events.on(mouseConstraint, "startdrag", () => {
        scene.style.cursor = "grabbing";
      });
      Matter.Events.on(mouseConstraint, "enddrag", () => {
        scene.style.cursor = "grab";
      });

      const step = () => {
        Matter.Engine.update(engine, 1000 / 60);
        for (let i = 0; i < bodies.length; i++) {
          const { x, y } = bodies[i].position;
          const a = bodies[i].angle;
          cardEls[i].style.transform = `translate(${x - CARD_W / 2}px, ${y - CARD_H / 2}px) rotate(${a}rad)`;
        }
        raf = requestAnimationFrame(step);
      };

      raf = requestAnimationFrame(step);
      setStatus("running — " + bodies.length + " cards");

      cleanupRef.current = () => {
        cancelAnimationFrame(raf);
        Matter.Engine.clear(engine);
        cardEls.forEach((el) => el.remove());
      };
    }).catch((err) => {
      setStatus("IMPORT ERROR: " + String(err));
      console.error("ScatteredCards import error:", err);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
    };
  }, []);

  return (
    <section data-section="scattered-cards" className="relative" style={{ height: "80vh", overflow: "hidden" }}>
      <div
        ref={sceneRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />
    </section>
  );
}
