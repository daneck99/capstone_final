# seat_class.py
class seatClass:
    def __init__(self, xPos, yPos, width, height, seatShape, seatNum, seatInfo, seatCount):
        self.xPos = xPos
        self.yPos = yPos
        self.width = width
        self.height = height
        self.seatShape = seatShape
        self.seatNum = seatNum
        self.seatInfo = seatInfo
        self.seatCount = seatCount

    def __getitem__(self, idx):
        return [
            self.xPos, self.yPos, self.width, self.height,
            self.seatShape, self.seatNum, self.seatInfo, self.seatCount
        ][idx]