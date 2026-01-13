import { useState } from 'react'
import './App.css'

function App() {
  const [num1, setNum1] = useState('')
  const [num2, setNum2] = useState('')
  const [operation, setOperation] = useState('+')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: parseFloat(num1),
          num2: parseFloat(num2),
          operation: operation,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '計算エラーが発生しました')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setNum1('')
    setNum2('')
    setOperation('+')
    setResult(null)
    setError('')
  }

  return (
    <div className="calculator-container">
      <h1>計算アプリ</h1>
      <div className="calculator">
        <div className="input-group">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="数値1"
            className="number-input"
          />
          
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="operation-select"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
          
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="数値2"
            className="number-input"
          />
        </div>

        <div className="button-group">
          <button
            onClick={handleCalculate}
            disabled={!num1 || !num2 || loading}
            className="calculate-button"
          >
            {loading ? '計算中...' : '計算する'}
          </button>
          <button onClick={handleClear} className="clear-button">
            クリア
          </button>
        </div>

        {result !== null && (
          <div className="result">
            <h2>結果: {result}</h2>
          </div>
        )}

        {error && (
          <div className="error">
            <p>エラー: {error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
