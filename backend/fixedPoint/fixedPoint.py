import numpy as np
from matplotlib import pyplot as plt


def originalFunction(x):  # Funcion original sin transformar
    f = (3*x)-np.exp(-2*x)
    return f


def transformedFunction(x):  # la funcion a trabajar, esté caso será la función g(x)
    g = np.exp(-2*x)/3
    return g


xi = 0

while (True):
    xn = transformedFunction(xi)
    if (abs(xn-xi)/xn < 0.000001):
        break
    xi = xn

# print(xn)

x = np.linspace(-3, 3, 100)
plt.figure()
plt.plot(x, originalFunction(x))
# Para visualizar la raiz en la grafica
plt.plot(xn, originalFunction(xn), marker="o")
# Agregar rejillas a la grafica
plt.grid()
plt.show()
