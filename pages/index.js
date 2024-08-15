import Login from "./components/login";
import connectdb from "@/lib/db";
import usuariosMaster from "@/models/usuariosMaster";


// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      const resp = await usuariosMaster.find({})
      const usuarioMaster = resp.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      return { props: { usuarioMaster } }
  } catch (err) {
      console.log(err)
      return { props: { usuarioMaster: [] } }
  }

}
// CLOSE SERVER

export default function Home({usuarioMaster}) {
  const {usuario, password} = usuarioMaster[0]

  return (
    <>
      <Login 
      usuario={usuario}
      password={password}
      />
    </>
  );
}
