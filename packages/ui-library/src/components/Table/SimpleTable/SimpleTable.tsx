import React from 'react'
import styles from './SimpleTable.module.scss'

export type SimpleTableProps = {
  list: string[][]
  headerList: string[]
}

const _SimpleTable = ({ list, headerList }: SimpleTableProps) => {
  console.log(`list: ${JSON.stringify(list)}`)
  return (
    <>
      <table className={styles.table}>
        <tr>
          {headerList.map((item) => {
            return <th key={item}>{item}</th>
          })}
        </tr>
        {list.map((itemRow) => {
          return (
            <tr key={itemRow[1]}>
              {itemRow.map((item) => {
                return <td key={item}>{item}</td>
              })}
            </tr>
          )
        })}
      </table>
    </>
  )
}

export const SimpleTable = React.memo(_SimpleTable)
