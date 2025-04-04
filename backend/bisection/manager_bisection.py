class manager_bisection:
    def __init__(self,function, point1,point2,iteration):
        self.function=function
        self.point1=point1
        self.point2=point2
        self.iteration=iteration
        
    '''
    metodo que calcula la raiz por medio del metodo de biseccion 
    
    '''
    def bisection(self):
        try:
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
        except:
            print("undifined q40")
    