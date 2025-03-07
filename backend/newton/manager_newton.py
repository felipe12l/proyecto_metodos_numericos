from sympy import symbols, diff, lambdify,sympify

class newton:
    def __init__(self,function:str,point,iterations,var):
        self.var=symbols(f"{var}")
        self.expr = sympify(function)
        self.function=lambdify(self.var,function)
        self.point=point
        self.iterations=iterations
        
        
    def __derivate(self):
        der_expr = diff(self.expr, self.var)  
        return lambdify(self.var, der_expr)  

            
    def calculate_newton(self):
        der=self.__derivate()
        
        while True:
            if self.iterations==0:
                break
            self.point=self.point-self.function(self.point)/der(self.point)
            self.iterations-=1
        return self.point
newtons=newton("x**3-x-1",1,10,"x")
print(newtons.calculate_newton())
        
