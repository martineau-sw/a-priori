# a-priori

Unit test micro-library for test-driven development of small 
personal projects and exercises. 

## Assertion

A test case that expects equality between expected and 
actual values. 

Consists of 3 required properties:
1. Label string
2. Function arguments
3. Expected value from inputs

## Test

Container for test cases that supplies the function to be 
tested and a function to determine if the test case has 
passed.

Consists of 3 required properties:
1. Target function
2. Condition function to evaluate equality
3. At least 1 test case

## Set

Container for tests for conveniently grouping tests. Has no
required properties.