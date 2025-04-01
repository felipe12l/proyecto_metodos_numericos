# proyecto_metodos_numericos

Calculadora de métodos numericos con microservicios

# Pruebas con postman

## fixed_point

1. Petición POST con la URL `http://localhost:5000/fixed_point`
2. Ejemplo de petición:

```json
{
  "funcion": "np.sin(x) - x/2",
  "derivada": "np.cos(x) - 0.5",
  "error_porcentaje": 5,
  "xi": 1.0
}
```

## gauss_seidel

1. Petición POST con la URL `http://localhost:5003/gauss_seidel`
2. Ejemplo de petición:

```json
{
  "A": [
    [10, 1, 2],
    [4, 6, -1],
    [-2, 3, 8]
  ],
  "b": [3, 9, 51],
  "error_porcentaje": 1e-8
}
```
