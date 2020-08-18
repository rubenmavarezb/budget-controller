
def total(w, t):
    sub_string = 0
    large = len(w)
    for i in range(large):
        if (w[i:i+len(t)]) == t:
            sub_string += 1
    return sub_string


print(total('ababa', 'aba'))
    
