import React from 'react'
import './style.css'
import Image from 'next/image'

interface Props {
  area_name: string
}

export default function Area({ area_name }: Props) {
  return (
    <div className="area">
      <div className="imageWrapper">
        <Image
        src="/Organization-Team-Work 1.png"
        alt={area_name}
        fill
        className="areaImage"
        />
      </div>
      <h2 className='areaName'>{area_name}</h2>
    </div>
  )
}