

def bisection(function:str,point1,point2, iteration):
    f=eval(f"lambda x:{function}")
    iteration-=1
    middle=(point1+point2)/2
    if iteration==0:
          return [middle,0]
    if f(middle)==0:
        return [middle,iteration]
    if f(point1)*f(middle)<0:
        return bisection(function,point1,middle,iteration)
    else:
        return bisection(function,middle,point2,iteration)


     
            