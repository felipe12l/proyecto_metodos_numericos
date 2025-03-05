import numpy as np
from matplotlib import pyplot as plt


def fun(x):
    g = np.exp(-2*x)/3  # la funcion a trabajar, esté caso será la función g(x)
    return g


xi = 0

while (True):
    xn = fun(xi)
    if (abs(xn-xi)/xn < 0.000001):
        break
    xi = xn

print(xn)
