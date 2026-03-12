import React from 'react'
import styles from './style.module.css'

interface Props {
  area_name: string
}

export default function Area({ area_name }: Props) {
  return (
    <div className={styles.area}>
      <h2 className={styles.areaName}>{area_name}</h2>
    </div>
  )
}