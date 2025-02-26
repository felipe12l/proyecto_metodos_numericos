class manager_bisection:
    def __init__(self,function, point1,point2,iteration):
        self.funtion=function
        self.point1=point1
        self.point2=point2
        self.iteration=iteration
        
    '''
    metodo que calcula la raiz por medio del metodo de biseccion 
    
    Args:
        function: funcion de tipo string que debeser funcional 
        punto1 punto inicial estrictamente menor

    '''
    def bisection(self):
        f=eval(f"lambda x:{self.function}")
        iteration-=1
        middle=(self.point1+self.point2)/2
        if iteration==0:
            return [middle,iteration]
        if f(middle)==0:
            return [middle,iteration]
        if f(self.point1)*f(middle)<0:
            return self.bisection(self.function,self.point1,middle,iteration)
        else:
            return self.bisection(self.function,middle,self.point2,iteration)
    
        