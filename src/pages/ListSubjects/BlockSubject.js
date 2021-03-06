// react-router-dom components
import { Skeleton, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import subjectAPI from "api/subjectAPI";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import TPCardItem from "components/TPCardItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import unknowExam from "../../assets/images/unknowExam.png";

const convertDatas = (datas) =>
  datas.map((data, idx) => {
    return {
      ...data,
      // idExam: data?.id,
      image: data?.image ? data?.image : unknowExam,
      name: data?.name,
    };
  });

const BlockExams = () => {
  const [listSubjects, setListSubjects] = useState();
  const [loading, setLoading] = useState(true);

  const getListExams = async (room) => {
    await subjectAPI.getSubjectForMe().then((res) => {
      if (res?.data) {
        const listSubjects = convertDatas(res?.data);
        setListSubjects(listSubjects);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getListExams(localStorage.getItem("room"));
  }, []);

  const renderListExams = () => {
    return (
      <Grid container spacing={6} maxWidth={1000}>
        {listSubjects?.map((subject, idx) => (
          <Grid item md={4} sm={6} xs={12} key={idx}>
            <Link to={"/detail-subject"} state={{ subject: subject }}>
              <TPCardItem
                image={subject.image}
                name={subject.name}
                type={"Câu hỏi"}
                count={subject.amount_question}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  };
  const renderSkeleton = () => {
    const arrayElement = [];
    for (let i = 0; i < 3; i++) {
      arrayElement.push(
        <Grid item xs={12} md={4} sx={{ mb: 2 }}>
          <Skeleton
            variant='rectangular'
            maxWidth
            sx={{ minHeight: "10rem", aspectRatio: "1/1", margin: "auto" }}
          />
          <Typography variant='h6' textAlign={"center"}>
            <Skeleton />
          </Typography>
          <Typography variant='button' textAlign={"center"}>
            <Skeleton />
          </Typography>
        </Grid>
      );
    }
    return (
      <Grid container spacing={6} maxWidth={800}>
        {arrayElement}
      </Grid>
    );
  };

  return (
    <MKBox component='section' py={6}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          flexDirection='column'
          alignItems='center'
          sx={{ textAlign: "center", mx: "auto", px: 0.75 }}
        >
          <MKTypography variant='h2' fontWeight='bold'>
            Các môn học
          </MKTypography>
          <MKTypography variant='body1' color='text'>
            Đây là các môn học mà bạn đang theo học
          </MKTypography>
        </Grid>
      </Container>
      <Container sx={{ mt: 6, justifyContent: "center", display: "flex" }}>
        {loading ? renderSkeleton() : renderListExams()}
      </Container>
    </MKBox>
  );
};

export default BlockExams;
