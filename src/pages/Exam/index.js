import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MENUBAR } from "./constant";
import QuestionNavbar from "./QuestionNavbar.js";
import "./exam.scss";
import QuestionDetail from "./QuestionDetail.js";
import examAPI from "api/examAPI";
import { STATUS } from "./constant";
import { SettingsCellRounded } from "@mui/icons-material";
import Countdown from "react-countdown";

import { useLocation } from 'react-router-dom'

const convertDatas = (datas) => {
  const result = datas?.map((data, idx) => {
    return {
      ...data,
      idx: idx,
      status: STATUS.NORESPONSE,
      curAnswer: -1,
    };
  });
  return result;
};

const Exam = (props) => {

  const location = useLocation();
  const [questions, setQuestions] = useState();
  const [questionAmount, setQuestionAmount] = useState(0);
  const [curQuestion, setCurQuestion] = useState("");
  const [curIndexQuestion, setCurIndexQuestion] = useState(0);
  const [nameTest, setNameTest] = useState("");
  const [duration, setDuration] = useState();
  const [minPointToPass, setMinPointToPass] = useState();
  const [startCountDown, setStartCountDown] = useState(false);
  const [loading, setLoading] = useState(true);

  const getExam = async (id) => {
    try {
      const params = {
        id: id,
      };
      await examAPI.getExam(params).then((res) => {
        if (res) {
          const data = res?.data
          const questions = convertDatas(data.questions);
          setNameTest(data?.name);
          setDuration(data?.duration);
          setMinPointToPass(data?.min_point_to_pass);
          setQuestions(questions);
          setQuestionAmount(questions.length);
          setCurQuestion(questions[0]);
          setLoading(false);
        }

      });
    } catch (error) {
      console.log({ error });
    }
  };

  const searchQuestionByIdx = (id, questions) => {
    if (questions) {
      for (let question of questions) {
        if (question?.idx == id) {
          setCurQuestion(question);
          break;
        }
      }
    }
  };

  // ham luu lai cau tra loi moi khi nguoi dung chon cau tra loi khac
  const saveAnswerOfQuestion = (question, listQuestions) => {
    if (questions) {
      let curQuestions = [...listQuestions];
      curQuestions[question.idx] = question;
      setQuestions(curQuestions);
    }
  };

  // call API
  useEffect(() => {
    getExam(location?.state?.idExam);
    // startCountDown(countDown);
  }, []);

  // tim cau hoi voi moi lua chon so cau
  useEffect(() => {
    searchQuestionByIdx(curIndexQuestion, questions);
  }, [curIndexQuestion]);

  //thay doi cau tra loi moi khi nguoi dung chon cau tra loi khac
  useEffect(() => {
    saveAnswerOfQuestion(curQuestion, questions);
  }, [curQuestion]);

  return (
    <Box className='exam__container'>
      <Box className='exam__container--left'>
        {
          loading
            ? <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </Box>
            : <QuestionNavbar
              questionAmount={questionAmount}
              setCurIndexQuestion={setCurIndexQuestion}
              curIndexQuestion={curIndexQuestion}
              curQuestion={curQuestion}
              questions={questions}
              loading={loading}
            />
        }
      </Box>
      <Box className='exam__container--right'>
        {
          loading
            ? <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </Box>
            : <QuestionDetail
              curQuestion={curQuestion}
              setCurQuestion={setCurQuestion}
              nameTest={nameTest}
              startCountDown={startCountDown}
              setStartCountDown={setStartCountDown}
              loading={loading}
              questions={questions}
              duration={duration}
              minPointToPass={minPointToPass}
              questionAmount={questionAmount}
            />
        }
      </Box>
    </Box>
  );
};

export default Exam;
