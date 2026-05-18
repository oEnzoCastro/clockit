import React from 'react'
import styles from './style.module.css'

interface Props {
  area_name: string
}

export default function Area({ area_name }: Props) {
  return (
    <div className={styles.area}>
      <span className={styles.areaName}>{area_name}</span>
    </div>
  )
}