import React from 'react'
import './style.css'
import Image, { StaticImageData } from 'next/image'

interface Props {
  text: string
  src: StaticImageData
  alt: string
}

export default function Area(){
    return (

        <div className="area">
            <div className="imageWrapper">
                <Image className="imagem" src="/Organization-Team-Work 1.png" alt="Plus" width={24} height={24} />
            </div>
            <h2>Area 1</h2>
        </div>

    )
}
