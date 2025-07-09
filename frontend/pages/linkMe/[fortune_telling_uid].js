import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "@/styles/Markdown.module.css";
import fortuneTellingUidStyles from "./fortune_telling_uid.module.css";
import extractDesktopDecoration from "@/tools/extractDesktopDecoration";
import extractFortuneTips from "@/tools/extractFortuneTips";
import formatBirthTime from "@/tools/formatBirthTime";
import LoadingSpinner from "@/components/LoadingSpinner";
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
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
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
import ChatMarkdownStack from "@/components/ChatMarkdownStack";
import StyledMarkdown from "@/components/StyledMarkdown";
import SpiritualPracticeView from "@/components/SpiritualPracticeView";
import { useRouter } from "next/router";
// Add API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:11337";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

// 枚举映射将从后端API获取



// 获取基本信息
function EditBasicInfo({ fortune_telling_uid, setIsEditing, isEditing }) {
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    birth_date: "",
    birth_time: "",
    height: "",
    weight: "",
    profession: "",
    constitution_type: "",
    sleep_quality: "",
    exercise_frequency: "",
    common_symptoms: [],
    dietary_preferences: [],
    body_discomfort: [],
    health_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fortuneTellingUserInfo, setFortuneTellingUserInfo] = useState({});
  const [enumMappings, setEnumMappings] = useState({});

  useEffect(() => {
    if (fortuneTellingUserInfo) {
      setFormData({
        username: fortuneTellingUserInfo.username || "",
        gender: fortuneTellingUserInfo.gender || "",
        birth_date: fortuneTellingUserInfo.birth_date || "",
        birth_time: fortuneTellingUserInfo.birth_time || "",
        height: fortuneTellingUserInfo.height || "",
        weight: fortuneTellingUserInfo.weight || "",
        profession: fortuneTellingUserInfo.profession || "",
        constitution_type: fortuneTellingUserInfo.constitution_type || "",
        sleep_quality: fortuneTellingUserInfo.sleep_quality || "",
        exercise_frequency: fortuneTellingUserInfo.exercise_frequency || "",
        common_symptoms: fortuneTellingUserInfo.common_symptoms || [],
        dietary_preferences: fortuneTellingUserInfo.dietary_preferences || [],
        body_discomfort: fortuneTellingUserInfo.body_discomfort || [],
        health_info: fortuneTellingUserInfo.health_info || "",
      });
    }
  }, [fortuneTellingUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (fieldName, value) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [fieldName]: newArray };
    });
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
      
      const submitData = {
        ...formData,
        birth_time: formatBirthTime(formData.birth_time),
      };
      
      // 处理空字段
      if (submitData.height === "") delete submitData.height;
      if (submitData.weight === "") delete submitData.weight;
      if (submitData.profession === "") delete submitData.profession;
      if (submitData.constitution_type === "") delete submitData.constitution_type;
      if (submitData.sleep_quality === "") delete submitData.sleep_quality;
      if (submitData.exercise_frequency === "") delete submitData.exercise_frequency;
      if (submitData.health_info === "") delete submitData.health_info;
      
      // 处理数组字段
      if (submitData.common_symptoms.length === 0) delete submitData.common_symptoms;
      if (submitData.dietary_preferences.length === 0) delete submitData.dietary_preferences;
      if (submitData.body_discomfort.length === 0) delete submitData.body_discomfort;
      
      await axios.put(
        `${API_BASE_URL}/api/fortune-telling-users/${fortuneTellingUserInfo.documentId}`,
        {
          data: submitData,
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

  const fetchEnumMappings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fortune-telling-users/enum-mappings`);
      setEnumMappings(response.data.data);
    } catch (error) {
      console.error('获取枚举映射失败:', error);
      // 如果获取失败，设置为空对象，UI会显示原始的枚举值
      setEnumMappings({});
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
    fetchEnumMappings();
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
              
              <Typography
                variant="subtitle1"
                sx={{ 
                  color: "#FFD700", 
                  fontWeight: "bold", 
                  textAlign: "center",
                  mt: 2,
                  mb: 1 
                }}
              >
                可选信息
              </Typography>
              
              <Select
                name="height"
                value={formData.height}
                onChange={handleChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  color: "#000",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  fontSize: 18,
                  height: 56,
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFD700",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#666" }}>
                  选择身高
                </MenuItem>
                {Array.from({ length: 201 }, (_, i) => {
                  const height = (50 + i) / 100; // 0.50m to 2.50m
                  return (
                    <MenuItem key={height} value={height}>
                      {height.toFixed(2)}米
                    </MenuItem>
                  );
                })}
              </Select>
              
              <Select
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  color: "#000",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  fontSize: 18,
                  height: 56,
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFD700",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#666" }}>
                  选择体重
                </MenuItem>
                {Array.from({ length: 196 }, (_, i) => {
                  const weight = 5 + i; // 5kg to 200kg
                  return (
                    <MenuItem key={weight} value={weight}>
                      {weight}公斤
                    </MenuItem>
                  );
                })}
              </Select>
              
              <TextField
                name="profession"
                label="职业"
                value={formData.profession}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="可选填写您的职业或工作领域..."
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
              
              <Typography
                variant="subtitle1"
                sx={{ 
                  color: "#FFD700", 
                  fontWeight: "bold", 
                  textAlign: "center",
                  mt: 3,
                  mb: 1 
                }}
              >
                健康状况评估
              </Typography>
              
              <Select
                name="constitution_type"
                value={formData.constitution_type}
                onChange={handleChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  color: "#000",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  fontSize: 18,
                  height: 56,
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFD700",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#666" }}>
                  选择体质类型
                </MenuItem>
                {Object.entries(enumMappings.constitution_type || {}).map(([value, label]) => (
                  <MenuItem key={value} value={value} sx={{ fontSize: "14px" }}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              
              <Select
                name="sleep_quality"
                value={formData.sleep_quality}
                onChange={handleChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  color: "#000",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  fontSize: 18,
                  height: 56,
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFD700",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#666" }}>
                  选择睡眠质量
                </MenuItem>
                {Object.entries(enumMappings.sleep_quality || {}).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              
              <Select
                name="exercise_frequency"
                value={formData.exercise_frequency}
                onChange={handleChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  color: "#000",
                  backgroundColor: "#FFD700",
                  borderRadius: 2,
                  fontSize: 18,
                  height: 56,
                  "& .MuiSelect-select": {
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFD700",
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "#666" }}>
                  选择运动频率
                </MenuItem>
                {Object.entries(enumMappings.exercise_frequency || {}).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                  常见症状 (可多选)
                </FormLabel>
                <FormGroup row>
                  {["失眠", "头痛", "胃痛", "便秘", "腹泻", "疲劳", "心悸", "咳嗽", "腰痛", "关节痛"].map((symptom) => (
                    <FormControlLabel
                      key={symptom}
                      control={
                        <Checkbox
                          checked={formData.common_symptoms.includes(symptom)}
                          onChange={() => handleCheckboxChange("common_symptoms", symptom)}
                          sx={{ color: "#FFD700", "&.Mui-checked": { color: "#FFD700" } }}
                        />
                      }
                      label={<span style={{ color: "#FFD700", fontSize: "14px" }}>{symptom}</span>}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                  饮食偏好 (可多选)
                </FormLabel>
                <FormGroup row>
                  {["偏爱辛辣", "偏爱甜食", "偏爱油腻", "偏爱生冷", "偏爱热食", "清淡饮食", "素食主义", "不规律饮食"].map((preference) => (
                    <FormControlLabel
                      key={preference}
                      control={
                        <Checkbox
                          checked={formData.dietary_preferences.includes(preference)}
                          onChange={() => handleCheckboxChange("dietary_preferences", preference)}
                          sx={{ color: "#FFD700", "&.Mui-checked": { color: "#FFD700" } }}
                        />
                      }
                      label={<span style={{ color: "#FFD700", fontSize: "14px" }}>{preference}</span>}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                  身体不适部位 (可多选)
                </FormLabel>
                <FormGroup row>
                  {["头部", "颈部", "肩部", "背部", "腰部", "腹部", "腿部", "脚部", "手部", "胸部"].map((part) => (
                    <FormControlLabel
                      key={part}
                      control={
                        <Checkbox
                          checked={formData.body_discomfort.includes(part)}
                          onChange={() => handleCheckboxChange("body_discomfort", part)}
                          sx={{ color: "#FFD700", "&.Mui-checked": { color: "#FFD700" } }}
                        />
                      }
                      label={<span style={{ color: "#FFD700", fontSize: "14px" }}>{part}</span>}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              
              <TextField
                name="health_info"
                label="补充说明"
                multiline
                rows={2}
                value={formData.health_info}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="其他需要说明的健康情况..."
                InputProps={{
                  sx: {
                    color: "#000",
                    backgroundColor: "#FFD700",
                    borderRadius: 2,
                    fontSize: 16,
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
                {fortuneTellingUserInfo.height && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      身高：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.height}米
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.weight && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      体重：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.weight}公斤
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.profession && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      职业：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.profession}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.constitution_type && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      体质：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.constitution_type_label || fortuneTellingUserInfo.constitution_type}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.sleep_quality && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      睡眠：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.sleep_quality_label || fortuneTellingUserInfo.sleep_quality}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.exercise_frequency && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      运动：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.exercise_frequency_label || fortuneTellingUserInfo.exercise_frequency}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.common_symptoms && fortuneTellingUserInfo.common_symptoms.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      症状：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.common_symptoms.join(", ")}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.dietary_preferences && fortuneTellingUserInfo.dietary_preferences.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      饮食：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.dietary_preferences.join(", ")}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.body_discomfort && fortuneTellingUserInfo.body_discomfort.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      不适：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                    >
                      {fortuneTellingUserInfo.body_discomfort.join(", ")}
                    </Typography>
                  </Stack>
                )}
                {fortuneTellingUserInfo.health_info && (
                  <Stack direction="row" spacing={1}>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-title"]}
                      sx={{ fontWeight: 600, color: "#1A237E" }}
                    >
                      补充：
                    </Typography>
                    <Typography
                      className={fortuneTellingUidStyles["user-info-value"]}
                      sx={{ 
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxWidth: "200px"
                      }}
                    >
                      {fortuneTellingUserInfo.health_info}
                    </Typography>
                  </Stack>
                )}
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

function LinkMe({ fortune_telling_uid }) {
  // 通过 url获取 uids参数, 如果uids参数存在，则使用uids参数，否则使用 fortune_telling_uid
  const { uids } = useRouter().query;
  const uidsArray = uids ? uids.split(",") : [fortune_telling_uid];

  return (
    <>
      {uidsArray.length === 1 && (
        <LinkMeContent fortune_telling_uid={uidsArray[0]} />
      )}
      {uidsArray.length > 1 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 0, 
            height: '100vh' 
          }}
        >
          {uidsArray.map((uid) => (
            <Box sx={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}>
              <LinkMeContent fortune_telling_uid={uid} />
            </Box>
          ))}
        </Box>
      )}
    </>

  );
}

function LinkMeContent({ fortune_telling_uid }) {
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

      setNewAIResponseIsStreaming(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsStreaming(false);
          setLoading(false);
          setNewAIResponseIsStreaming(false);
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
