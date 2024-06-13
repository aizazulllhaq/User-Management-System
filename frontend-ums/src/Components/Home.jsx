import About from "./Layouts/AboutSection";
import Achivements from "./Layouts/AchivementsSection";
import Footer from "./Layouts/Footer";
import MainSection from "./Layouts/MainSection";
import Navbar from "./Layouts/Navbar";

const Home = () => {
  return (
    <>
      {/* Header ( Navbar )  */}
      <Navbar path={"home"}/>

      {/* Main Section  */}
      <MainSection />

      {/* About Section  */}
      <About />

      {/* Achivements  */}
      <Achivements />

      {/*  Footer  */}
      <Footer />
    </>
  );
};

export default Home;
