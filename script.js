body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

h1 {
    text-align: center;
}

.input-panel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

input {
    width: 80px;
    padding: 4px;
}

button {
    grid-column: span 3;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}

