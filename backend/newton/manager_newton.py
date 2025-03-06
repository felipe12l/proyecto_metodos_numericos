from sympy import symbols, diff, Derivative

class newton:
    def __init__(self,function:str,point,iterations):
        self.function=function
        self.point=point
        self.iterations=iterations
    def derivate(self):
        try:
            x=symbols("x")
            return derivate_func=Derivative(self.function,{"x":x}).doit

        except ValueError:
            print(ValueError)
    def calculate_newton(self):
        der=self.derivate()
