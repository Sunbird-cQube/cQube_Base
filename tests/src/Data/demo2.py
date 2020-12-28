import os
import time
import unittest


# class time_counter(unittest.TestSuite):
        # hour = int(input('Enter any amount of hours you want -+==> '))
        # minute = int(input('Enter any amount of minutes you want -+==> '))
        # second = int(input('Enter any amount of seconds you want -+==> '))
        # time = hour*10800 + minute*3600 + second*60
        # print('{}:{}:{}'.format(hour,minute,second))
        # while time > 0:
        #    time = time - 1
        #    seconds = (time // 60) % 60
        #    minutes = (time // 3600)
        #    hours = (time // 10800)
        #    print('Time Left -+==> ',hours,':',minutes,':',seconds,)
        #    os.system("CLS")
        # if time == 0:
        #    print('Time Is Over!')

        # import time as t
        # ##this will enable to utilize specified functions within time library such as sleep()
        # ##Asking user the duration for which the user wants to delay the process
        # seconds = int(input("How many seconds to wait"))
        # ##Let's use a ranged loop to create the counter
        # for i in range(seconds):
        #     print(str(seconds - i) + " seconds remaining \n")
        # ##we also need the loop to wait for 1 second between each iteration
        # t.sleep(1)
        # print("Time is up")

import datetime

x = datetime.datetime.now()
print("Started time is ", x)
time.sleep(60*30)
y = datetime.datetime.now()
print("Ending time",y)