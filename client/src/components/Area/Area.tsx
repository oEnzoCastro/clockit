import React from 'react'
import './style.css'
import Image, { StaticImageData } from 'next/image'

interface Props {
  text: string
  src: StaticImageData
  alt: string
}

export default function Content({text, src, alt}: Props) {
    return (

        <div className="area">
            <div className="imageWrapper">
                <Image src={src} alt={alt} className="areaImage" />
            </div>
            <h2>{text}</h2>
        </div>

    )
}
