class IdNotFound(Exception):
    def __init__(self, value):
        self.value = value
        self.message = f"{value} not found!"
        
    def __str__(self):
        return self.message
