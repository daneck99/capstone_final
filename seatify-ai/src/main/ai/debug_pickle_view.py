import pickle

with open('./backup/seatData.p', 'rb') as f:
    obj = pickle.load(f)
    print("=== Type of loaded object:", type(obj))
    print("=== Value:", obj)