test:
	clear && mocha --require chai --recursive --reporter spec --slow 1 -t 5000

.PHONY: test