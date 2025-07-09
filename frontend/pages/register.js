import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Stack,
  Input,
  Select,
  MenuItem,
  Button,
  Alert,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import FortuneMasterAvatar from "../components/FortuneMasterAvatar";

// {
//   "data": {
//     "username": "张三",
//     "gender": "male",
//     "birth_date": "1990-01-01",
//     "birth_time": "08:00:00",
//     "fortune_telling_uid": "unique-uid-001"
//   }
// }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:11337";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

// 格式化时间为 HH:mm:ss.SSS
function formatBirthTime(time) {
  if (!time) return "";
  if (/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(time)) return time;
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time + ".000";
  return time + ":00.000";
}

export default function Register() {
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
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [enumMappings, setEnumMappings] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchEnumMappings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/fortune-telling-users/enum-mappings`);
        setEnumMappings(response.data.data);
      } catch (error) {
        console.error('获取枚举映射失败:', error);
        // 如果获取失败，使用默认映射
      }
    };
    fetchEnumMappings();
  }, []);

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
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const fortune_telling_uid = `uid-${Date.now()}-${Math.floor(Math.random()*10000)}`;
      const submitData = {
        ...formData,
        birth_time: formatBirthTime(formData.birth_time),
        fortune_telling_uid,
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
      
      await axios.post(
        `${API_BASE_URL}/api/fortune-telling-users`,
        {
          data: submitData,
        },
        {
          headers: {
            Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
          },
        }
      );
      setSuccess("注册成功！");
      setFormData({ 
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
      router.push(`/linkMe/${fortune_telling_uid}`);
    } catch (err) {
      setError("注册失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('/api/random-desk-decor-bg')",
        backgroundSize: { xs: 'cover', md: 'cover' },
        backgroundRepeat: "no-repeat",
        backgroundPosition: { xs: 'center', md: 'center' },
        py: { xs: 4, md: 8 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 4, paddingTop: 4 }}>
        <FortuneMasterAvatar size={120} />
      </Box>

      <Container maxWidth="sm">
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
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold", color: "#FFD700" }}
            >
              用户注册
            </Typography>
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
                      color: '#000',
                      fontWeight: 'bold',
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: '#FFD700',
                        color: '#000',
                        px: 0.5,
                        borderRadius: 1,
                        zIndex: 1,
                      }
                    }
                  }}
                />
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{
                    justifyContent: 'center',
                    backgroundColor: '#FFD700',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mb: 1,
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }} />}
                    label={<span style={{ color: '#000', fontWeight: 'bold' }}>男♂</span>}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }} />}
                    label={<span style={{ color: '#000', fontWeight: 'bold' }}>女♀</span>}
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
                  InputLabelProps={{ shrink: true, sx: {
                    color: '#000',
                    fontWeight: 'bold',
                    '&.MuiInputLabel-shrink': {
                      backgroundColor: '#FFD700',
                      color: '#000',
                      px: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    }
                  }}}
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
                  InputLabelProps={{ shrink: true, sx: {
                    color: '#000',
                    fontWeight: 'bold',
                    '&.MuiInputLabel-shrink': {
                      backgroundColor: '#FFD700',
                      color: '#000',
                      px: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    }
                  }}}
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
                
                <Box sx={{ position: 'relative', mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      color: "#FFD700", 
                      fontWeight: "bold", 
                      textAlign: "center",
                      mt: 2,
                      mb: 2 
                    }}
                  >
                    可选信息
                  </Typography>
                  
                  <Stack spacing={3}>
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
                          color: '#000',
                          fontWeight: 'bold',
                          '&.MuiInputLabel-shrink': {
                            backgroundColor: '#FFD700',
                            color: '#000',
                            px: 0.5,
                            borderRadius: 1,
                            zIndex: 1,
                          }
                        }
                      }}
                    />
                  </Stack>
                  
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      color: "#FFD700", 
                      fontWeight: "bold", 
                      textAlign: "center",
                      mt: 4,
                      mb: 2 
                    }}
                  >
                    健康状况评估
                  </Typography>
                  
                  <Stack spacing={3}>
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
                    
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                        常见症状 (可多选)
                      </FormLabel>
                      <FormGroup row>
                        {(enumMappings.common_symptoms_options || []).map((symptom) => (
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
                    
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                        饮食偏好 (可多选)
                      </FormLabel>
                      <FormGroup row>
                        {(enumMappings.dietary_preferences_options || []).map((preference) => (
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
                    
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                        身体不适部位 (可多选)
                      </FormLabel>
                      <FormGroup row>
                        {(enumMappings.body_discomfort_options || []).map((part) => (
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
                          color: '#000',
                          fontWeight: 'bold',
                          '&.MuiInputLabel-shrink': {
                            backgroundColor: '#FFD700',
                            color: '#000',
                            px: 0.5,
                            borderRadius: 1,
                            zIndex: 1,
                          }
                        }
                      }}
                    />
                  </Stack>

                  {/* 毛玻璃蒙层 */}
                  {!showOptionalFields && (
                    <Box
                      onClick={() => setShowOptionalFields(true)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: 4,
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          transform: 'scale(1.01)',
                        }
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          mb: 2,
                          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        }}
                      >
                        ✨ 完善详细信息
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#FFFFFF',
                          textAlign: 'center',
                          fontWeight: 500,
                          px: 3,
                          lineHeight: 1.6,
                          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                        }}
                      >
                        填写身高体重、健康状况等信息<br/>
                        获得更精准的个性化算命建议<br/>
                        <small style={{ opacity: 0.9, color: '#FFD700' }}>（点击此处展开填写）</small>
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, rgba(255,215,0,0.4), rgba(255,215,0,0.2))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.1)',
                              opacity: 0.7,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Typography sx={{ color: '#FFD700', fontSize: '24px' }}>
                          👆
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#FFD700",
                    color: "#000",
                    border: '2px solid #FFD700',
                    borderRadius: 2,
                    height: 56,
                    fontSize: 18,
                    mt: 1,
                    '&:hover': {
                      backgroundColor: '#FFC300',
                      color: '#000',
                      border: '2px solid #FFD700',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#FFD700',
                      color: '#333',
                      opacity: 0.7,
                      border: '2px solid #FFD700',
                    },
                  }}
                >
                  {loading ? "注册中..." : "注册"}
                </Button>
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
