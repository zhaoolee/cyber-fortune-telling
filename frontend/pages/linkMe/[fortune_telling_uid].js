import { useEffect, useState, useRef } from "react";
import axios from "axios";
import converter from "@/tools/converter";
import styles from "@/styles/Markdown.module.css";
import fortuneTellingUidStyles from "./fortune_telling_uid.module.css";
import goFullScreen from "@/tools/getFullScreen";
import exitFullScreen from "@/tools/exitFullScreen";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Stack,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Input,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import SignInCalendar from "@/components/SignInCalendar";
import FortuneMasterAvatar from "@/components/FortuneMasterAvatar";
import getGenderEmoji from "@/tools/getGenderEmoji";
import getZodiacByDate from "@/tools/getZodiacByDate";
import getChineseTraditionalTime from "@/tools/getChineseTraditionalTime";
import getChineseTraditionalDate from "@/tools/getChineseTraditionalDate";
import ChatInput from "@/components/ChatInput";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ChatMarkdownStack from "@/components/ChatMarkdownStack";
import StyledMarkdown from "@/components/StyledMarkdown";
// Add API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:11337";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

// Function to extract desktop decoration image source
const extractDesktopDecoration = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const deskDecorImg = doc.querySelector("img.desk-decor");
  return deskDecorImg ? deskDecorImg.getAttribute("src") : "";
};

// Function to extract fortune tips
const extractFortuneTips = (content) => {
  // Convert markdown to HTML first
  const htmlContent = converter.makeHtml(content);
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const tipElements = doc.querySelectorAll(".fortune-tip");
  const tips = Array.from(tipElements).map((tip) => {
    // Remove any leading numbers, dots, and whitespace
    return tip.textContent.replace(/^\d*\.?\s*/, "");
  });
  return tips;
};

// Add custom loading animation component
const LoadingSpinner = () => (
  <Box
    component="img"
    src="/loading.png"
    alt="Loading..."
    sx={{
      width: 60,
      height: 60,
      animation:
        "customRotate 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
      "@keyframes customRotate": {
        "0%": {
          transform: "rotate(0deg)",
        },
        "50%": {
          transform: "rotate(180deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    }}
  />
);

// 格式化时间为 HH:mm:ss.SSS
function formatBirthTime(time) {
  if (!time) return "";
  if (/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(time)) return time;
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time + ".000";
  return time + ":00.000";
}

// 获取基本信息
function EditBasicInfo({ fortune_telling_uid, setIsEditing, isEditing }) {
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    birth_date: "",
    birth_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fortuneTellingUserInfo, setFortuneTellingUserInfo] = useState({});

  useEffect(() => {
    if (fortuneTellingUserInfo) {
      setFormData({
        username: fortuneTellingUserInfo.username || "",
        gender: fortuneTellingUserInfo.gender || "",
        birth_date: fortuneTellingUserInfo.birth_date || "",
        birth_time: fortuneTellingUserInfo.birth_time || "",
      });
    }
  }, [fortuneTellingUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      if (!fortuneTellingUserInfo || !fortuneTellingUserInfo.documentId) {
        setError("无效的用户信息");
        return;
      }
      await axios.put(
        `${API_BASE_URL}/api/fortune-telling-users/${fortuneTellingUserInfo.documentId}`,
        {
          data: {
            ...formData,
            birth_time: formatBirthTime(formData.birth_time),
          },
        },
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      setSuccess("保存成功！");
      setIsEditing(false);
    } catch (error) {
      setError("保存失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const fetchBasicUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/api/fortune-telling-users?username=*&filters[fortune_telling_uid][$eq]=${fortune_telling_uid}`,
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      setFortuneTellingUserInfo(response.data.data[0]);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasicUserInfo();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        py: { xs: 4, md: 8 },
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 4px 32px 0 #FFD70044",
          border: "2px solid #FFD700",
          background: "#000000",
          mb: 3,
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} mt={3}>
              <TextField
                name="username"
                label="用户名"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: {
                    color: "#000",
                    backgroundColor: "#FFD700",
                    borderRadius: 2,
                    fontSize: 18,
                    height: 56,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#000",
                    fontWeight: "bold",
                    "&.MuiInputLabel-shrink": {
                      backgroundColor: "#FFD700",
                      color: "#000",
                      px: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    },
                  },
                }}
              />
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                sx={{
                  justifyContent: "center",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mb: 1,
                }}
              >
                <FormControlLabel
                  value="male"
                  control={
                    <Radio
                      sx={{ color: "#000", "&.Mui-checked": { color: "#000" } }}
                    />
                  }
                  label={
                    <span style={{ color: "#000", fontWeight: "bold" }}>
                      男♂
                    </span>
                  }
                />
                <FormControlLabel
                  value="female"
                  control={
                    <Radio
                      sx={{ color: "#000", "&.Mui-checked": { color: "#000" } }}
                    />
                  }
                  label={
                    <span style={{ color: "#000", fontWeight: "bold" }}>
                      女♀
                    </span>
                  }
                />
              </RadioGroup>
              <TextField
                name="birth_date"
                label="出生日期"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "#000",
                    fontWeight: "bold",
                    "&.MuiInputLabel-shrink": {
                      backgroundColor: "#FFD700",
                      color: "#000",
                      px: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    color: "#000",
                    backgroundColor: "#FFD700",
                    borderRadius: 2,
                    fontSize: 18,
                    height: 56,
                  },
                }}
              />
              <TextField
                name="birth_time"
                label="出生时间"
                type="time"
                value={formData.birth_time}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: "#000",
                    fontWeight: "bold",
                    "&.MuiInputLabel-shrink": {
                      backgroundColor: "#FFD700",
                      color: "#000",
                      px: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    color: "#000",
                    backgroundColor: "#FFD700",
                    borderRadius: 2,
                    fontSize: 18,
                    height: 56,
                  },
                }}
              />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#FFD700",
                    color: "#000",
                    border: "2px solid #FFD700",
                    borderRadius: 2,
                    height: 56,
                    fontSize: 18,
                    mt: 1,
                    "&:hover": {
                      backgroundColor: "#FFC300",
                      color: "#000",
                      border: "2px solid #FFD700",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#FFD700",
                      color: "#333",
                      opacity: 0.7,
                      border: "2px solid #FFD700",
                    },
                  }}
                >
                  {loading ? "加载中..." : "保存"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  sx={{
                    borderColor: "#FFD700",
                    color: "#FFD700",
                    borderRadius: 2,
                    height: 56,
                    fontWeight: "bold",
                    fontSize: 18,
                    "&:hover": {
                      borderColor: "#F4C430",
                      color: "#F4C430",
                    },
                  }}
                >
                  取消
                </Button>
              </Stack>
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

function ShowBasicInfo({
  fortuneTellingUserInfo,
  getFortuneTellingUserInfoLoading,
  getFortuneTellingUserInfoError,
  isStreaming,
  loading,
  setIsEditing,
  genderEmoji,
  setGenderEmoji,
}) {
  const [zodiac, setZodiac] = useState("");
  const [chineseTraditionalTime, setChineseTraditionalTime] = useState("");
  const [chineseTraditionalDate, setChineseTraditionalDate] = useState("");
  // 根据出生日期获取生肖
  useEffect(() => {
    if (fortuneTellingUserInfo && fortuneTellingUserInfo.birth_date) {
      setZodiac(getZodiacByDate(fortuneTellingUserInfo.birth_date));
    }
  }, [fortuneTellingUserInfo?.birth_date]);

  // 根据birth_time 获取中国传统时间 getChineseTraditionalTime
  useEffect(() => {
    if (fortuneTellingUserInfo && fortuneTellingUserInfo.birth_time) {
      setChineseTraditionalTime(
        getChineseTraditionalTime(fortuneTellingUserInfo.birth_time)
      );
    }
  }, [fortuneTellingUserInfo?.birth_time]);

  // 根据birth_date 获取中国传统日期 getChineseTraditionalDate
  useEffect(() => {
    if (fortuneTellingUserInfo && fortuneTellingUserInfo.birth_date) {
      setChineseTraditionalDate(
        getChineseTraditionalDate(fortuneTellingUserInfo.birth_date)
      );
    }
  }, [fortuneTellingUserInfo?.birth_date]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: "0 4px 32px 0 #FFD70044",
          border: "2px solid #FFD700",
          background: "rgba(255,255,255,0.95)",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#1A237E",
                fontWeight: 700,
                textAlign: "center",
                mb: 0,
              }}
            >
              基本信息
            </Typography>
            {!isStreaming && (
              <Button
                variant="text"
                size="small"
                sx={{ minWidth: 0, ml: 1, p: 0, color: "#1A237E" }}
                disabled={loading || isStreaming}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon fontSize="small" />
              </Button>
            )}
          </Box>
          {getFortuneTellingUserInfoLoading && (
            <Box display="flex" justifyContent="center" my={2}>
              <LoadingSpinner />
            </Box>
          )}
                  {getFortuneTellingUserInfoError && (
          <Alert severity="error">
            {getFortuneTellingUserInfoError?.message || 
             getFortuneTellingUserInfoError?.toString() || 
             "获取用户信息失败"}
          </Alert>
        )}
          {!getFortuneTellingUserInfoLoading &&
            !getFortuneTellingUserInfoError &&
            fortuneTellingUserInfo && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <Typography
                    className={fortuneTellingUidStyles["user-info-title"]}
                    sx={{ fontWeight: 600, color: "#1A237E" }}
                  >
                    姓名：
                  </Typography>
                  <Typography
                    className={`${fortuneTellingUidStyles["username"]} ${fortuneTellingUidStyles["user-info-value"]}`}
                  >
                    {fortuneTellingUserInfo.username}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography
                    className={fortuneTellingUidStyles["user-info-title"]}
                    sx={{ fontWeight: 600, color: "#1A237E" }}
                  >
                    性别：
                  </Typography>
                  <Typography
                    className={fortuneTellingUidStyles["user-info-value"]}
                    key={fortuneTellingUserInfo.gender}
                  >
                    {fortuneTellingUserInfo.gender === "male"
                      ? "♂ " + genderEmoji
                      : "♀ " + genderEmoji}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography
                    className={fortuneTellingUidStyles["user-info-title"]}
                    sx={{ fontWeight: 600, color: "#1A237E" }}
                  >
                    生日：
                  </Typography>
                  <Typography
                    className={`${fortuneTellingUidStyles["birth_date"]} ${fortuneTellingUidStyles["user-info-value"]}`}
                  >
                    {fortuneTellingUserInfo.birth_date} {chineseTraditionalDate}{" "}
                    {zodiac}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography
                    className={fortuneTellingUidStyles["user-info-title"]}
                    sx={{ fontWeight: 600, color: "#1A237E" }}
                  >
                    时间：
                  </Typography>
                  <Typography
                    className={`${fortuneTellingUidStyles["birth-time"]} ${fortuneTellingUidStyles["user-info-value"]}`}
                  >
                    {fortuneTellingUserInfo.birth_time} {chineseTraditionalTime}
                  </Typography>
                </Stack>
              </Stack>
            )}
        </CardContent>
      </Card>
    </Box>
  );
}

// 创建占卜视图组件
function FortuneTellingView({
  fortune_telling_uid,
  isEditing,
  setIsEditing,
  fortuneTellingUserInfo,
  setFortuneTellingUserInfo,
  getFortuneTellingUserInfoLoading,
  getFortuneTellingUserInfoError,
  loading,
  error,
  isStreaming,
  fortuneData,
  streamingText,
  allowRunFortuneTellingRequest,
  desktopDecoration,
  requestFortuneTellingInfo,
  setSpiritualPractice,
  genderEmoji,
  setGenderEmoji,
}) {
  return (
    <Stack spacing={3} alignItems="center">
      <Box sx={{ height: 20 }} />
      <FortuneMasterAvatar size={120} />

      {isEditing ? (
        <EditBasicInfo
          fortune_telling_uid={fortune_telling_uid}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <ShowBasicInfo
            fortune_telling_uid={fortune_telling_uid}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            setFortuneTellingUserInfo={setFortuneTellingUserInfo}
            fortuneTellingUserInfo={fortuneTellingUserInfo}
            getFortuneTellingUserInfoLoading={getFortuneTellingUserInfoLoading}
            getFortuneTellingUserInfoError={getFortuneTellingUserInfoError}
            isStreaming={isStreaming}
            loading={loading}
            genderEmoji={genderEmoji}
            setGenderEmoji={setGenderEmoji}
          />

          {loading && <LoadingSpinner />}
          {error && <Alert severity="error">{error}</Alert>}

          {(isStreaming || fortuneData) && (
            <Card sx={{ maxWidth: 800, width: "100%", margin: "20px" }}>
              <CardContent>
                <div className={styles["waving-container"]}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    className={`${
                      isStreaming ? styles["mystical-title"] : ""
                    } ${styles["wave-text"]}`}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {[..."✨满血大圆满玄乎儿大师曰"].map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </Typography>
                </div>
                <StyledMarkdown
                  content={
                    isStreaming ? streamingText : fortuneData.textResponse
                  }
                />
              </CardContent>
            </Card>
          )}

          <Stack direction="row" spacing={2}>
            {!fortuneData && !isStreaming && allowRunFortuneTellingRequest ? (
              <Button
                variant="contained"
                onClick={requestFortuneTellingInfo}
                disabled={loading || isStreaming}
              >
                开始占卜
              </Button>
            ) : desktopDecoration ? (
              <Button
                variant="contained"
                onClick={() => {
                  console.log("进入玄修");
                  setSpiritualPractice(true);
                }}
                sx={{
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: 1000,
                }}
              >
                玄修 {genderEmoji}
              </Button>
            ) : null}
          </Stack>
          <Box sx={{ height: 10 }} />
        </>
      )}
    </Stack>
  );
}

// 创建玄修视图组件
function SpiritualPracticeView({
  tips,
  currentTip,
  animationKey,
  desktopDecoration,
  setSpiritualPractice,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);


  // useEffect(() => {
  //   if (isFullScreen) {
  //     exitFullScreen();
  //   } else {
  //     goFullScreen();
  //   }
  // }, [isFullScreen]);
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        backgroundImage:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('/api/random-desk-decor-bg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* 右上角小按钮，点击即可进入全屏按钮, 进入全屏后，点击即可退出全屏 */}
      {isFullScreen === false && <IconButton
        color="primary"
        onClick={() => {
          setIsFullScreen(true);
          goFullScreen();
        }}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <FullscreenIcon sx={{ fontSize: 32, color: "#FFD700" }} />
      </IconButton>}
      {isFullScreen === true && <IconButton
        color="primary"
        onClick={() => {
          setIsFullScreen(false);
          exitFullScreen();
        }}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <FullscreenExitIcon sx={{ fontSize: 32, color: "#FFD700" }} />
      </IconButton>}

      {tips.length > 0 && (
        <motion.div
          key={animationKey}
          style={{
            position: "fixed",
            bottom: "15vh",
            zIndex: 1000,
            maxWidth: "calc(100% - 40px)",
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "8px",
            border: "2px solid #FFD700",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, 0, 0, -20],
            transition: {
              duration: 10,
              repeat: 0,
              ease: "easeInOut",
              times: [0, 0.1, 0.9, 1],
            },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#FFD700",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            }}
          >
            {currentTip}
          </Typography>
        </motion.div>
      )}

      {desktopDecoration && (
        <motion.div
          style={{
            filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))",
          }}
          animate={{
            scale: [1, 1.02, 1],
            filter: [
              "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))",
              "drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))",
              "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          <Box
            component="img"
            src={desktopDecoration}
            // 双击触发
            onDoubleClick={() => {
              setIsFullScreen(!isFullScreen);
              if (isFullScreen) {
                exitFullScreen();
              } else {
                goFullScreen();
              }
            }}
            alt="桌面装饰"
            sx={{
              height: "61.8vh",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              "@media (maxWidth: 600px)": {
                height: "auto",
                maxHeight: "61.8vh",
              },
            }}
          />
        </motion.div>
      )}
      {isFullScreen === false && <IconButton
        color="primary"
        onClick={() => setSpiritualPractice(false)}
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 2,
          // backgroundColor: '#1A237E',
          boxShadow: "0 2px 8px #FFD70044",
          "&:hover": {
            border: "2px solid #FFD700",
          },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 32, color: "#FFD700" }} />
      </IconButton>}
    </Box>
  );
}

function LinkMe({ fortune_telling_uid }) {
  // 使用状态来存储请求结果
  const [fortuneData, setFortuneData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 控制展示态，还是编辑态
  const [isEditing, setIsEditing] = useState(false);
  // 用于存储流式接收的文本
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  // 创建玄修状况控制 spiritual practice
  const [spiritualPractice, setSpiritualPractice] = useState(false);
  // 添加一个存储桌面装饰图片的变量
  const [desktopDecoration, setDesktopDecoration] = useState("");
  // 存储tips
  const [tips, setTips] = useState([]);
  // 添加当前显示的tip状态
  const [currentTip, setCurrentTip] = useState("");
  // 添加动画状态
  const [animationKey, setAnimationKey] = useState(0);
  const [fortuneTellingUserInfo, setFortuneTellingUserInfo] = useState({});
  const [getFortuneTellingUserInfoError, setGetFortuneTellingUserInfoError] =
    useState(null);
  const [
    getFortuneTellingUserInfoLoading,
    setGetFortuneTellingUserInfoLoading,
  ] = useState(false);
  // 添加allowRunFortuneTellingRequest变量
  const [allowRunFortuneTellingRequest, setAllowRunFortuneTellingRequest] =
    useState(false);
  // 获取conversation_id
  const [conversationId, setConversationId] = useState("");
  // 存储用户输入的prompt
  const [prompt, setPrompt] = useState("");
  // === 可配置参数 ===
  const REFRESH_HOUR = 0; // 目标小时
  // 添加一个5分钟的随机数, 用于避免多个用户同时刷新
  const REFRESH_MINUTE = 0 + Math.floor(Math.random() * 5); // 目标分钟
  // 添加一个30秒的随机数, 用于避免多个用户同时刷新
  const CHECK_INTERVAL = 30000; // 检查间隔（毫秒）

  // 新的AI对话回复
  const [newAIResponse, setNewAIResponse] = useState("");
  // 新的AI对话输出状态
  const [newAIResponseIsStreaming, setNewAIResponseIsStreaming] =
    useState(false);
  // 为ChatInput管理不可用状态
  const [chatInputDisabled, setChatInputDisabled] = useState(false);
  // 设置一个变量用于记录requestFortuneTellingInfo 是否完成
  const [requestFortuneTellingInfoDone, setRequestFortuneTellingInfoDone] =
    useState(false);
  // 设置一个变量用于记录genderEmoji
  const [genderEmoji, setGenderEmoji] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);

  const [currentChatList, setCurrentChatList] = useState([]);
  const MAX_CHAT_LIST_LENGTH = 30;

  // 如果 conversationHistory 和  currentChatList 的总长度超过MAX_CHAT_LIST_LENGTH，则隐藏Input输入框，在输入框位置显示明天见
  const [showInput, setShowInput] = useState(true);
  useEffect(() => {
    if (
      conversationHistory.length + currentChatList.length >
      MAX_CHAT_LIST_LENGTH
    ) {
      setShowInput(false);
    }
  }, [conversationHistory, currentChatList]);

  // 控制历史记录折叠展开
  const [historyOpen, setHistoryOpen] = useState(false);

  // 当 requestFortuneTellingInfoDone 为 true 时，获取conversation_id
  useEffect(() => {
    if (requestFortuneTellingInfoDone) {
      // 延迟1秒再获取conversation_id
      setTimeout(() => {
        getConversationId();
      }, 1000);
    }
  }, [requestFortuneTellingInfoDone]);

  useEffect(() => {
    if (fortuneTellingUserInfo && fortuneTellingUserInfo.gender) {
      setGenderEmoji(getGenderEmoji(fortuneTellingUserInfo.gender));
    }
  }, [fortuneTellingUserInfo?.gender]);

  const getConversationId = async () => {
    // 当参数都有效时，再进行请求
    if (
      fortuneTellingUserInfo.username &&
      fortuneTellingUserInfo.gender &&
      fortuneTellingUserInfo.birth_date &&
      fortuneTellingUserInfo.birth_time
    ) {
      const response = await fetch(
        `${API_BASE_URL}/api/anything-request/getConversationIdAndHistory?fortune_telling_uid=${fortune_telling_uid}&stream=true&date=${moment().format(
          "YYYY-MM-DD"
        )}&birth_date=${fortuneTellingUserInfo.birth_date}&username=${
          fortuneTellingUserInfo.username
        }&gender=${fortuneTellingUserInfo.gender}&birth_time=${
          fortuneTellingUserInfo.birth_time
        }`,
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      const data = await response.json();
      setConversationId(data.conversation_id);
      setConversationHistory(data.conversation_history);
      setChatInputDisabled(false);
    }
  };

  // 发送prompt
  const sendPrompt = async () => {
    if (prompt.length === 0) {
      return;
    } else {
      setCurrentChatList((prev) => [
        ...prev,
        { role: "user", content: prompt },
      ]);
      const response = await fetch(
        `${API_BASE_URL}/api/anything-request/getAnswerFromLLM`,
        {
          method: "POST",
          body: JSON.stringify({
            conversationId: conversationId,
            prompt: prompt,
          }),
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      setPrompt("");

      // 模仿requestFortuneTellingInfo 进行流式读取, 将发来的数据实时通过setNewAIResponse 进行更新
      setNewAIResponseIsStreaming(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setNewAIResponse(accumulatedText);
          setChatInputDisabled(false);
          setNewAIResponseIsStreaming(false);
          break;
        }
        const text = decoder.decode(value);
        buffer += text;
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              if (line === "data: [DONE]") {
                setNewAIResponse(accumulatedText);

                setCurrentChatList((prev) => [
                  ...prev,
                  { role: "assistant", content: accumulatedText },
                ]);

                setChatInputDisabled(false);
                setNewAIResponseIsStreaming(false);
                break;
              }
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.content) {
                accumulatedText += jsonData.content;
                setNewAIResponse(accumulatedText);
              }
            } catch (e) {
              console.log("Parsing error:", e);
              // Continue processing other lines even if one fails
              setNewAIResponseIsStreaming(false);
              continue;
            }
          }
        }
      }
    }
  };

  // 检查用户信息是否完整
  useEffect(() => {
    console.log("检查用户信息是否完整==", fortuneTellingUserInfo);
    if (fortuneTellingUserInfo) {
      const { username, gender, birth_date, birth_time } =
        fortuneTellingUserInfo;
      const isValid = Boolean(username && gender && birth_date && birth_time);
      setAllowRunFortuneTellingRequest(isValid);
      // 如果信息完整且没有正在进行的请求，自动触发占卜
      if (isValid && !loading && !isStreaming) {
        requestFortuneTellingInfo();
      }
    }
  }, [fortuneTellingUserInfo]);

  // 发送请求获取用户信息
  const fetchFortuneTellingUserData = async () => {
    try {
      setGetFortuneTellingUserInfoLoading(true);
      setGetFortuneTellingUserInfoError(null);
      // 发送 GET 请求
      const response = await axios.get(
        `${API_BASE_URL}/api/fortune-telling-users?username=*&filters[fortune_telling_uid][$eq]=${fortune_telling_uid}&date=${moment().format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      // 设置用户信息
      setFortuneTellingUserInfo(response.data.data[0]);
      console.log("设置用户信息==", response.data.data[0]);
    } catch (err) {
      setGetFortuneTellingUserInfoError(err);
    } finally {
      setGetFortuneTellingUserInfoLoading(false);
    }
  };

  // 页面加载完成后自动获取fetchFortuneTellingUserData

  useEffect(() => {
    if (isEditing === false) {
      fetchFortuneTellingUserData();
    }
  }, [isEditing]);

  // 使用useEffect来管理动画和tip更新
  useEffect(() => {
    if (tips.length > 0 && spiritualPractice) {
      // 立即设置第一个随机tip
      const randomIndex = Math.floor(Math.random() * tips.length);
      setCurrentTip(tips[randomIndex]);

      // 设置定时器每5秒更新一次动画和tip
      const interval = setInterval(() => {
        const newRandomIndex = Math.floor(Math.random() * tips.length);
        setCurrentTip(tips[newRandomIndex]);
        setAnimationKey((prev) => prev + 1); // 强制重新渲染动画
      }, 10000); // 增加为10秒

      // 清理定时器
      return () => clearInterval(interval);
    }
  }, [tips, spiritualPractice]);

  // 开始占卜, 发送请求获取数据
  const requestFortuneTellingInfo = async () => {
    setRequestFortuneTellingInfoDone(false);
    console.log("开始占卜");
    try {
      setLoading(true);
      setError(null);
      setStreamingText("");
      setIsStreaming(true);
      // username, gender, birth_date, birth_time
      console.log(
        "开始占卜==",
        `${API_BASE_URL}/api/anything-request?fortune_telling_uid=${fortune_telling_uid}&stream=true&date=${moment().format(
          "YYYY-MM-DD"
        )}&birth_date=${fortuneTellingUserInfo.birth_date}&username=${
          fortuneTellingUserInfo.username
        }&gender=${fortuneTellingUserInfo.gender}&birth_time=${
          fortuneTellingUserInfo.birth_time
        }`
      );
      const response = await fetch(
        `${API_BASE_URL}/api/anything-request?fortune_telling_uid=${fortune_telling_uid}&stream=true&date=${moment().format(
          "YYYY-MM-DD"
        )}&birth_date=${fortuneTellingUserInfo.birth_date}&username=${
          fortuneTellingUserInfo.username
        }&gender=${fortuneTellingUserInfo.gender}&birth_time=${
          fortuneTellingUserInfo.birth_time
        }`,
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsStreaming(false);
          setLoading(false);
          // Extract desktop decoration when streaming is done
          const decorationSrc = extractDesktopDecoration(accumulatedText);
          if (decorationSrc) {
            setDesktopDecoration(decorationSrc);
          }
          break;
        }

        const text = decoder.decode(value);
        buffer += text;
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              if (line === "data: [DONE]") {
                setFortuneData({ textResponse: accumulatedText });
                // Extract desktop decoration and fortune tips when streaming is done
                const decorationSrc = extractDesktopDecoration(accumulatedText);
                if (decorationSrc) {
                  setDesktopDecoration(decorationSrc);
                }
                const extractedTips = extractFortuneTips(accumulatedText);
                if (extractedTips.length > 0) {
                  setTips(extractedTips);
                }
                // 首次占卜请求完成
                setRequestFortuneTellingInfoDone(true);
                break;
              }
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.content) {
                accumulatedText += jsonData.content;
                setStreamingText(accumulatedText);
              }
            } catch (e) {
              console.log("Parsing error:", e);
              // Continue processing other lines even if one fails
              continue;
            }
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Streaming error:", err);
      setIsStreaming(false);
      setLoading(false);
    }
  };

  // 添加：监听本地时间，特定时刻刷新页面
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}`;
      const lastRefresh = localStorage.getItem("lastAutoRefresh");

      if (
        now.getHours() === REFRESH_HOUR &&
        now.getMinutes() === REFRESH_MINUTE &&
        lastRefresh !== todayStr
      ) {
        localStorage.setItem("lastAutoRefresh", todayStr);
        console.log("时间符合条件刷新页面");
        window.location.reload();
      }
    }, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('/api/random-desk-decor-bg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {spiritualPractice === false && (
        <>
          <FortuneTellingView
            genderEmoji={genderEmoji}
            setGenderEmoji={setGenderEmoji}
            fortune_telling_uid={fortune_telling_uid}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            fortuneTellingUserInfo={fortuneTellingUserInfo}
            setFortuneTellingUserInfo={setFortuneTellingUserInfo}
            getFortuneTellingUserInfoLoading={getFortuneTellingUserInfoLoading}
            getFortuneTellingUserInfoError={getFortuneTellingUserInfoError}
            loading={loading}
            error={error}
            isStreaming={isStreaming}
            fortuneData={fortuneData}
            streamingText={streamingText}
            allowRunFortuneTellingRequest={allowRunFortuneTellingRequest}
            desktopDecoration={desktopDecoration}
            requestFortuneTellingInfo={requestFortuneTellingInfo}
            setSpiritualPractice={setSpiritualPractice}
          />

          {/* 创建一个折叠历史记录的div, 点击可以展开，默认折叠 */}
          {conversationId && conversationHistory.length > 0 && (
            <Box sx={{ my: 2, maxWidth: 800, mx: "auto" }}>
              <Button
                variant="outlined"
                onClick={() => setHistoryOpen((open) => !open)}
                sx={{
                  mb: 1,
                  color: "#FFD700",
                  borderColor: "#FFD700",
                  fontWeight: "bold",
                }}
                fullWidth
              >
                {historyOpen
                  ? "收起历史对话"
                  : `展开历史对话（${conversationHistory.length}条）`}
              </Button>
              {historyOpen && (
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    border: "1px solid #FFD700",
                    borderRadius: 2,
                    p: 1,
                    background: "rgba(0,0,0,0.05)",
                  }}
                >
                  {conversationHistory.map((item, index) => {
                    return (
                      <ChatMarkdownStack
                        genderEmoji={genderEmoji}
                        username={fortuneTellingUserInfo.username}
                        key={"conversationHistory" + index}
                        item={item}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          )}
          {/* 当前的对话记录 */}
          <div className="currentChatList">
            {currentChatList.map((item, index) => {
              return (
                <ChatMarkdownStack
                  genderEmoji={genderEmoji}
                  username={fortuneTellingUserInfo.username}
                  key={"currentChatList" + index}
                  item={item}
                />
              );
            })}
          </div>

          {newAIResponse && newAIResponseIsStreaming === true && (
            <ChatMarkdownStack item={{ content: newAIResponse }} />
          )}

          <div
            style={{
              height: "100px",
            }}
          >
            {showInput === false ? (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#FFD700",
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  background: "rgba(0,0,0,0.5)",
                  padding: "10px 0",
                }}
              >
                明天见
              </div>
            ) : null}
          </div>

          {/* 创建一个Input 和一个发送按钮的组合 */}
          {conversationId &&
            newAIResponseIsStreaming === false &&
            showInput === true && (
              <ChatInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onSend={sendPrompt}
                disabled={chatInputDisabled}
                setChatInputDisabled={setChatInputDisabled}
              />
            )}

          {/* 签到浮窗组件 */}
          <SignInCalendar
            fortune_telling_uid={fortune_telling_uid}
            API_BASE_URL={API_BASE_URL}
            API_TOKEN={API_TOKEN}
          />
        </>
      )}

      {spiritualPractice === true && (
        <SpiritualPracticeView
          tips={tips}
          currentTip={currentTip}
          animationKey={animationKey}
          desktopDecoration={desktopDecoration}
          setSpiritualPractice={setSpiritualPractice}
        />
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { fortune_telling_uid } = params;
    return {
      props: {
        fortune_telling_uid: fortune_telling_uid,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}

export default LinkMe;
