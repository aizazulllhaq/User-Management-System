import About from "./AboutSection";
import Achivements from "./AchivementsSection";
import Footer from "./Layouts/Footer";
import Navbar from "./Layouts/Navbar";
import MainSection from "./MainSection";

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
