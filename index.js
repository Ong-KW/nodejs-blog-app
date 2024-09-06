import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import compression from "compression";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowsMS: 1*60*1000,
    max: 20,
});

env.config();

const app = express();
const port = process.env.PORT;

var postlist = [
    {
        id: 1,
        date: new Date("2024-03-12").toDateString(),
        title: "Revolutionizing Solar Energy: The Latest Advances in Photovoltaic Technology",
        author: "Ethan Brookes",
        content: "Recent advancements in photovoltaic systems are revolutionizing solar energy efficiency and application. The latest technologies include bifacial solar panels, which capture sunlight from both sides for increased energy yield, and perovskite solar cells, known for their high efficiency and lower production costs. Additionally, innovations in solar tracking systems, which adjust the panel orientation to follow the sun, and integrated storage solutions, like solar batteries, are enhancing energy capture and utilization. These developments are driving the push towards more efficient, affordable, and adaptable solar power solutions, paving the way for broader adoption and integration into various energy grids."
    },
    {
        id: 2,
        date: new Date("2024-04-22").toDateString(),
        title: "Driving Toward the Future: Innovations and Trends in Electric Vehicles",
        author: "Maya Patel",
        content: "The future of electric vehicles (EVs) promises transformative changes in transportation and sustainability. As battery technology advances, we can expect significantly increased ranges and faster charging times, making EVs more practical for everyday use. Innovations in autonomous driving technology are set to redefine mobility, with self-driving EVs offering greater safety and convenience. Additionally, the integration of renewable energy sources for charging infrastructure will further reduce the carbon footprint of EVs. With growing investments in EV technology and supportive government policies, the shift towards electric vehicles is poised to accelerate, driving a cleaner, smarter future for transportation."
    },
    {
        id: 3,
        date: new Date("2024-05-19").toDateString(),
        title: "Cutting-Edge Innovations Shaping the Future of IoT",
        author: "Liam Johnson",
        content: "Recent advancements in Internet of Things (IoT) technology are shaping its future with notable innovations. The deployment of 5G networks enhances IoT by providing faster data speeds and lower latency. Edge computing reduces latency by processing data closer to its source, while AI and machine learning enable advanced analytics and smarter decision-making. New, more efficient sensors expand IoT's capabilities, and blockchain improves security and transparency. Additionally, Low-Power Wide-Area Networks (LPWANs) facilitate long-range, low-energy communication. Together, these technologies are enhancing the functionality and security of IoT systems."
    }
];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": "self",
        }
    })
);
app.use(limiter);

app.post("/update", (req, res) => {

    let updatedPost = {
        id: req.body["postId"],
        date: "Updated " + new Date().toDateString(),
        title: req.body["postTitle"],
        author: req.body["postAuthor"],
        content: req.body["postContent"]
    };

    let index = postlist.findIndex((post) => {
        return post.id === parseInt(updatedPost.id);
    });

    postlist.splice(index, 1, updatedPost);
    console.log(postlist);

    res.redirect("/");
})

app.post("/delete", (req, res) => {

    const searchId = req.body["postId"];

    let index = postlist.findIndex((post) => {
        return post.id === parseInt(searchId);
    });

    postlist.splice(index, 1);

    res.redirect("/");
});

app.post("/submit", (req, res) => {

    let id = postlist.length + 1;

    let post = {
        id: id,
        date: new Date().toDateString(),
        title: req.body["postTitle"],
        author: req.body["postAuthor"],
        content: req.body["postContent"]
    };

    postlist.push(post);

    res.redirect("/");
});

app.get("/", (req, res) => {
    
    res.render("index.ejs", {
        postList: postlist
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});