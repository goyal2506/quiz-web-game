import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  Radio,
  RadioGroup,
  Flex,
  List,
  ListItem,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ResultDetails = ({ userAnswers }) => (
  <Box maxW="800px" mx="auto" mt={8} bg="white" p={8} rounded="2xl" shadow="xl">
    <Heading size="lg" mb={6} color="purple.600">
      Detailed Results
    </Heading>
    <List spacing={6}>
      {userAnswers.map((answer, i) => (
        <ListItem
          key={i}
          p={4}
          rounded="lg"
          bg={answer.isCorrect ? "green.50" : "red.50"}
          borderLeft="4px solid"
          borderColor={answer.isCorrect ? "green.500" : "red.500"}
        >
          <Flex align="flex-start">
            <Icon
              as={answer.isCorrect ? CheckCircleIcon : CloseIcon}
              color={answer.isCorrect ? "green.500" : "red.500"}
              mt={1}
              mr={3}
              boxSize={5}
            />
            <Box flex="1">
              <Text
                fontWeight="bold"
                dangerouslySetInnerHTML={{
                  __html: `Q${i + 1}: ${answer.question}`,
                }}
                mb={2}
              />
              
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontWeight="semibold">Your Answer:</Text>
                <Text
                  as="span"
                  dangerouslySetInnerHTML={{ __html: ` ${answer.userSelection}` }}
                  color={answer.isCorrect ? "green.700" : "red.700"}
                  ml={1}
                />
                {answer.isCorrect ? null : (
                  <Text as="span" ml={4} color="green.700">
                    <Text as="span" fontWeight="semibold">Correct Answer:</Text>
                    <Text
                      as="span"
                      dangerouslySetInnerHTML={{ __html: ` ${answer.correctAnswer}` }}
                      ml={1}
                    />
                  </Text>
                )}
              </Text>
            </Box>
          </Flex>
        </ListItem>
      ))}
    </List>
  </Box>
);

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const options = useMemo(() => {
    if (!questions.length) return [];
    const current = questions[index];
    return shuffleArray([...current.incorrect_answers, current.correct_answer]);
  }, [questions, index]);

  const handleNext = () => {
    if (!selected) return;

    setLocked(true);

    const isCorrect = selected === questions[index].correct_answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setUserAnswers(prev => [
      ...prev,
      {
        question: questions[index].question,
        userSelection: selected,
        correctAnswer: questions[index].correct_answer,
        isCorrect: isCorrect,
      }
    ]);

    setTimeout(() => {
      setLocked(false);
      setSelected("");
      if (index + 1 < questions.length) {
        setIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  if (!questions.length) {
    return (
      <Box
        textAlign="center"
        p={10}
        minH="100vh"
        bgGradient="linear(to-br, purple.600, pink.400)"
        color="white"
      >
        <Heading>No quiz data available</Heading>
        <Button mt={4} onClick={() => navigate("/")} colorScheme="pink">
          Go Back
        </Button>
      </Box>
    );
  }

  const current = questions[index];

  return (
    <Box
      p={10}
      minH="100vh"
      minW="100vw"
      bgGradient="linear(to-br, purple.600, pink.400)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {!showResult ? (
        <Box
          maxW="600px"
          w="full"
          mx="auto"
          bg="white"
          p={8}
          rounded="2xl"
          shadow="2xl"
          transform="translateY(-5px)"
          transition="transform 0.2s"
        >
          <Heading mb={4} color="purple.600">
            Question {index + 1} / {questions.length}
          </Heading>

          <Text
            fontSize="xl"
            mb={6}
            fontWeight="bold"
            dangerouslySetInnerHTML={{ __html: current.question }}
          />

          <RadioGroup value={selected} onChange={setSelected}>
            <VStack align="stretch" spacing={4}>
              {options.map((opt, i) => {
                let bgGradient = "linear(to-r, white, gray.50)";
                let shadow = "md";
                let borderColor = "gray.200";

                if (locked) {
                  if (opt === current.correct_answer) {
                    bgGradient = "linear(to-r, green.300, teal.300)";
                    shadow = "xl";
                  } else if (opt === selected && opt !== current.correct_answer) {
                    bgGradient = "linear(to-r, red.300, orange.300)";
                    shadow = "xl";
                  }
                } else if (opt === selected) {
                    borderColor = "purple.500";
                    shadow = "lg";
                }

                return (
                  <Radio
                    key={i}
                    value={opt}
                    size="lg"
                    borderWidth={2}
                    borderColor={borderColor}
                    p={4}
                    rounded="lg"
                    bgGradient={bgGradient}
                    shadow={shadow}
                    isDisabled={locked}
                    _hover={!locked ? { transform: "scale(1.02)", shadow: "xl" } : {}}
                    transition="all 0.15s ease-in-out"
                  >
                    <Text
                      dangerouslySetInnerHTML={{ __html: opt }}
                      fontSize="md"
                      fontWeight="medium"
                    />
                  </Radio>
                );
              })}
            </VStack>
          </RadioGroup>

          <Flex mt={8} justify="flex-end">
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleNext}
              disabled={!selected || locked}
              boxShadow="0 4px 6px rgba(128, 90, 213, 0.4)"
              _hover={{ boxShadow: "0 6px 8px rgba(128, 90, 213, 0.6)", transform: "translateY(-2px)" }}
            >
              {index + 1 === questions.length ? "Finish Quiz" : "Next"}
            </Button>
          </Flex>
        </Box>
      ) : (
        <>
          <Box
            textAlign="center"
            bg="white"
            p={10}
            rounded="2xl"
            shadow="2xl"
            color="purple.600"
            maxW="600px"
            w="full"
          >
            <Heading>Quiz Finished! 🎉</Heading>
            <Text mt={4} fontSize="2xl">
              Your Score:{" "}
              <Text as="b" color="pink.500">
                {score}
              </Text>{" "}
              / {questions.length}
            </Text>
            <Button mt={6} colorScheme="purple" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Box>
          <ResultDetails userAnswers={userAnswers} /> 
        </>
      )}
    </Box>
  );
};

export default Quiz;