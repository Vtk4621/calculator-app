from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI()

# CORS設定（Reactからのリクエストを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteのデフォルトポート
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    num1: float
    num2: float
    operation: Literal["+", "-", "*", "/"]

class CalculationResponse(BaseModel):
    result: float
    operation: str

@app.get("/")
def read_root():
    return {"message": "Calculator API is running"}

@app.post("/calculate", response_model=CalculationResponse)
def calculate(request: CalculationRequest):
    try:
        if request.operation == "+":
            result = request.num1 + request.num2
        elif request.operation == "-":
            result = request.num1 - request.num2
        elif request.operation == "*":
            result = request.num1 * request.num2
        elif request.operation == "/":
            if request.num2 == 0:
                raise HTTPException(status_code=400, detail="ゼロで割ることはできません")
            result = request.num1 / request.num2
        else:
            raise HTTPException(status_code=400, detail="無効な演算子です")
        
        return CalculationResponse(
            result=result,
            operation=f"{request.num1} {request.operation} {request.num2}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)