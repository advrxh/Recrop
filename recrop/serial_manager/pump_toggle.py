def toggle_pump_state(redis):

    pump_state = redis.get("pump").decode("utf-8")

    if int(pump_state) == 1:
        return True
    elif int(pump_state) == 0:
        return False