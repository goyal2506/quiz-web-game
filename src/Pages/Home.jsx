import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Select,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("0");
  const [amount, setAmount] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [type, setType] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlay = async () => {
    setLoading(true);
    setError("");

    const url = `https://opentdb.com/api.php?amount=${amount}${
      category !== "0" ? `&category=${category}` : ""
    }${
      difficulty !== "0" ? `&difficulty=${difficulty}` : ""
    }${
      type !== "0" ? `&type=${type}` : ""
    }`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No questions found. Try different settings.");
        setLoading(false);
        return;
      }

      navigate("/quiz", { state: { questions: data.results } });
    } catch (err) {
      setError("Error fetching data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      p={8}
      minW="100vw"
      bgGradient="linear(to-br, purple.600, pink.400)"
    >
      <Box
        p={8}
        bg="white"
        rounded="2xl"
        shadow="2xl"
        w={{ base: "90%", sm: "480px" }}
        maxW="90%"
        transform="translateY(-5px)"
        transition="transform 0.2s"
      >
        <VStack align="stretch" spacing={5}>
          <Heading fontSize="3xl" textAlign="center" color="purple.600" mb={2}>
            The Ultimate Trivia Quiz
          </Heading>
          
          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" color="pink.500" thickness="4px" />
            </Flex>
          ) : (
            <>
              {error && (
                <Text color="red.500" textAlign="center" fontWeight="bold">
                  {error}
                </Text>
              )}

              <Box>
                <Text mb={1} fontWeight="medium" color="gray.700">
                  In which category do you want to play?
                </Text>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  size="lg"
                  variant="filled"
                  colorScheme="purple"
                >
                  <option value="0">Any Category</option>
                  <option value="9">General Knowledge</option>
                  <option value="10">Entertainment: Books</option>
                  <option value="11">Entertainment: Films</option>
                  <option value="12">Entertainment: Music</option>
                  <option value="13">Entertainment: Musicals & Theatres</option>
                  <option value="14">Entertainment: Television</option>
                  <option value="15">Entertainment: Video Games</option>
                  <option value="16">Entertainment: Board Games</option>
                  <option value="17">Science & Nature</option>
                  <option value="18">Science: Computers</option>
                  <option value="19">Science: Mathematics</option>
                  <option value="20">Mythology</option>
                  <option value="21">Sports</option>
                  <option value="22">Geography</option>
                  <option value="23">History</option>
                  <option value="24">Politics</option>
                  <option value="25">Arts</option>
                  <option value="26">Celebrities</option>
                  <option value="27">Animals</option>
                  <option value="28">Vehicles</option>
                  <option value="29">Entertainment: Comics</option>
                  <option value="30">Science: Gadgets</option>
                  <option value="31">Entertainment: Japanese Anime & Manga</option>
                  <option value="32">Entertainment: Cartoon & Animations</option>
                </Select>
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="gray.700">
                  How many questions do you want?
                </Text>
                <Select
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  size="lg"
                  variant="filled"
                  colorScheme="purple"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                </Select>
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="gray.700">
                  How difficult should it be?
                </Text>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  size="lg"
                  variant="filled"
                  colorScheme="purple"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </Box>

              <Box>
                <Text mb={1} fontWeight="medium" color="gray.700">
                  Which type of questions?
                </Text>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  size="lg"
                  variant="filled"
                  colorScheme="purple"
                >
                  <option value="0">Any Type</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">True / False</option>
                </Select>
              </Box>

              <Button
                colorScheme="pink"
                size="lg"
                mt={3}
                leftIcon={<Text fontSize="xl">▶</Text>}
                onClick={handlePlay}
                boxShadow="0 4px 6px rgba(237, 100, 166, 0.4)"
                _hover={{ boxShadow: "0 6px 8px rgba(237, 100, 166, 0.6)", transform: "translateY(-2px)" }}
              >
                Play Now
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default Home;