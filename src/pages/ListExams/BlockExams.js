// react-router-dom components
import { CircularProgress } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import examAPI from "api/examAPI";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import TPCardItem from "components/TPCardItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import image2 from '../../assets/images/team-2.jpg';





const convertDatas = (datas) => datas.map((data, idx) => {
  return {
    idExam: data?.id,
    image: image2,
    name: data?.name,
    questionAmount: data?.questions.length,
    route: '/exam'
  }
})

const BlockExams = () => {

  const [listExams, setListExams] = useState();
  const [loading, setLoading] = useState(true);

  const getListExams = async (room) => {

    const params = {
      room: room,
    };

    await examAPI.getListExamForRoom(params).then((res) => {
      if (res?.data) {
        const listExams = convertDatas(res?.data)
        setListExams(listExams)
        setLoading(false)
      }
    })

  };


  useEffect(() => {
    getListExams('AI');
  }, []);

  const renderListExams = () => {

    return (
      <Grid container spacing={4}>
        {listExams?.map(({ image, name, questionAmount, route, idExam }, idx) => (
          <Grid item xs={12} md={4} sx={{ mb: 2 }} key={name} >
            <Link to={route} state={{ idExam: idExam }}>
              <TPCardItem image={image} name={name} type={'Câu hỏi'} count={questionAmount} />
            </Link>
          </Grid>
        ))
        }
      </Grid >
    )
  }

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
          sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
        >
          <MKTypography variant='h2' fontWeight='bold'>
            Các bài thi
          </MKTypography>
          <MKTypography variant='body1' color='text'>
            Đây là các bài thi mà bạn có thể thi
          </MKTypography>
        </Grid>
      </Container>
      <Container sx={{ mt: 6, textAlign: 'center' }} >{loading ? <CircularProgress size={80} /> : renderListExams()}</Container>
    </MKBox>
  );
}

export default BlockExams;