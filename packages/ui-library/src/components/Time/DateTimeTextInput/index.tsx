import { memo, useCallback, useEffect, useRef } from 'react'
import { useState } from 'react'
import { MouseEvent } from 'react'
import { TextInput } from '../../Input'
import { getDateTimeText, getNextActiveDateTimeKey, getNumberKey } from './dateTimeHelpers'
import {
  getSelectionRange,
  sortedDateTimeKeyInfo,
  getDateTimeKey,
  updateDateTimeValue,
  isMoveNextFocusFromNewValue,
} from './dateTimeHelpers'
import { DateTimeKey, DateTimeValues } from './index.types'

interface Props {
  value?: DateTimeValues
  placeholder?: string
  format?: string
  onChange: (value: DateTimeValues) => void
}

const _DateTimeTextInput = ({ value, placeholder, format = 'YYYY-MM-DD', onChange }: Props) => {
  const [textHighlightTrigger, setTextHighlightTrigger] = useState(false)
  const [dateTimeValue, setDateTimeValue] = useState<DateTimeValues | undefined>(value)
  const [activeDateTimeKey, setActiveDateTimeKey] = useState<{
    current: DateTimeKey | undefined
    previous: DateTimeKey | undefined
  }>({ current: undefined, previous: undefined })
  const [zeroPaddingCount, setZeroPaddingCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDateTimeValue(value)
  }, [value])

  useEffect(() => {
    if (activeDateTimeKey.current) {
      highlightSelectionText(activeDateTimeKey.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDateTimeKey, textHighlightTrigger])

  const highlightSelectionText = (dateTimeKey: DateTimeKey | undefined) => {
    if (dateTimeKey === undefined) {
      return
    }
    const selectionPosition = getSelectionRange(dateTimeKey, format)
    if (selectionPosition) {
      inputRef.current?.setSelectionRange(selectionPosition.start, selectionPosition.end)
      inputRef.current?.focus()
    }
  }

  const handleSelect = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      e.preventDefault()
      const clickedPosition = e.currentTarget.selectionStart
      if (clickedPosition === null) {
        return
      }
      console.log(`clickedPostion: ${JSON.stringify(clickedPosition)}`)
      const selectedDateTimeKey = getDateTimeKey(clickedPosition, format)
      console.log(`selectedDateTImeKey: ${JSON.stringify(selectedDateTimeKey)}`)
      highlightSelectionText(selectedDateTimeKey)
      if (selectedDateTimeKey === activeDateTimeKey.current) {
        return
      }

      if (!selectedDateTimeKey) {
        const lastDtKey = sortedDateTimeKeyInfo(format).slice(-1)[0]?.dateTimeKey
        setActiveDateTimeKey({
          current:
            activeDateTimeKey.current === lastDtKey
              ? lastDtKey
              : sortedDateTimeKeyInfo(format)[0]?.dateTimeKey,
          previous: activeDateTimeKey.current,
        })
      }
      setActiveDateTimeKey({
        current: selectedDateTimeKey,
        previous: activeDateTimeKey.current,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeDateTimeKey],
  )

  const handleInput = useCallback(() => {
    setTextHighlightTrigger((prev) => !prev)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (activeDateTimeKey.current === undefined || dateTimeValue === undefined) {
        return
      }

      const newValue = updateDateTimeValue(
        e.code,
        dateTimeValue!,
        activeDateTimeKey as { current: DateTimeKey; previous: DateTimeKey | undefined },
        zeroPaddingCount,
      )
      setDateTimeValue(newValue)
      onChange(newValue)
      if (newValue && newValue[activeDateTimeKey.current] === 0) {
        setZeroPaddingCount((prev) => prev++)
      }

      let moveStep =
        isMoveNextFocusFromNewValue(newValue, activeDateTimeKey.current, zeroPaddingCount) &&
        getNumberKey(e.code)
          ? 1
          : 0
      if (e.code === 'ArrowRight' || e.code === 'Tab') {
        moveStep = 1
      }
      if (e.code === 'ArrowLeft' || (e.code === 'Tab' && e.shiftKey)) {
        moveStep = -1
      }
      const nextActiveKey = getNextActiveDateTimeKey(activeDateTimeKey.current, moveStep, format)
      setActiveDateTimeKey((prev) => {
        return { current: nextActiveKey, previous: prev.current }
      })
      if (e.code === 'Tab' && nextActiveKey === activeDateTimeKey.current) {
        return
      }
      e.preventDefault()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeDateTimeKey, dateTimeValue],
  )

  const handleFocus = useCallback(() => {
    if (dateTimeValue === undefined) {
      setDateTimeValue({
        year: undefined,
        month: undefined,
        day: undefined,
        hour: undefined,
        minute: undefined,
        second: undefined,
      })
    }
  }, [dateTimeValue])

  const handleBlur = useCallback(() => {
    const isAllKeyUndefined = Object.keys(dateTimeValue!).every(
      (key) => dateTimeValue![key as keyof DateTimeValues] === undefined,
    )
    if (isAllKeyUndefined) {
      setDateTimeValue(undefined)
    }
    setActiveDateTimeKey({
      current: undefined,
      previous: undefined,
    })
  }, [dateTimeValue])

  return (
    <TextInput
      ref={inputRef}
      value={getDateTimeText(dateTimeValue, format)}
      placeholder={placeholder}
      onSelect={handleSelect}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}

export const DateTimeTextInput = memo(_DateTimeTextInput)
