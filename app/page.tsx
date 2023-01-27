"use client"
import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={"mt-20 text-center"}>
      <Link href="/arrows">
        <div className={"text-8xl"}>⤏</div>
        <div className={"font-mono text-sm text-zinc-400"}>arrows</div>
      </Link>
    </div>
  )
}
