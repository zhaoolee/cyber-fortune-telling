import { useState, useEffect } from "react";
import { Box, IconButton, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import goFullScreen from "@/tools/getFullScreen";
import exitFullScreen from "@/tools/exitFullScreen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

// DualTime 组件
function DualTimeComponent({ desktopDecoration, tips, currentTip, animationKey }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 番茄钟状态管理
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25分钟（秒）
  const [breakTime, setBreakTime] = useState(5 * 60); // 5分钟（秒）
  const [currentSession, setCurrentSession] = useState(25 * 60); // 初始为25分钟
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  // 今日完成周期管理
  const [todayCycles, setTodayCycles] = useState(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toLocaleDateString('zh-CN');
      const savedData = localStorage.getItem('pomodoroTodayCycles');
      
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          // 如果是今天的数据，则返回保存的周期数
          if (data.date === today) {
            return data.cycles;
          }
        } catch (e) {
          console.error('读取番茄钟数据失败:', e);
        }
      }
      
      // 如果没有数据或不是今天的数据，则返回0
      return 0;
    }
    return 0;
  });

  // 保存今日周期到localStorage
  const saveTodayCycles = (cycles) => {
    if (typeof window !== 'undefined') {
      const today = new Date().toLocaleDateString('zh-CN');
      const data = {
        date: today,
        cycles: cycles,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('pomodoroTodayCycles', JSON.stringify(data));
    }
  };

  // 检查并更新今日周期（处理跨日期情况）
  const checkAndUpdateTodayCycles = () => {
    if (typeof window !== 'undefined') {
      const today = new Date().toLocaleDateString('zh-CN');
      const savedData = localStorage.getItem('pomodoroTodayCycles');
      
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          // 如果保存的不是今天的数据，重置为0
          if (data.date !== today) {
            setTodayCycles(0);
            saveTodayCycles(0);
          }
        } catch (e) {
          console.error('检查番茄钟数据失败:', e);
          setTodayCycles(0);
          saveTodayCycles(0);
        }
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // 每分钟检查一次日期变化
      checkAndUpdateTodayCycles();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 番茄钟定时器
  useEffect(() => {
    let interval = null;
    if (isRunning && currentSession > 0) {
      interval = setInterval(() => {
        setCurrentSession(currentSession => currentSession - 1);
      }, 1000);
    } else if (currentSession === 0) {
      // 时间到了，切换状态
      if (isBreak) {
        // 休息结束，开始新的工作周期
        setCurrentSession(pomodoroTime);
        setIsBreak(false);
        // 休息结束后增加今日完成周期
        const newCycles = todayCycles + 1;
        setTodayCycles(newCycles);
        saveTodayCycles(newCycles);
      } else {
        // 工作结束，开始休息
        setCurrentSession(breakTime);
        setIsBreak(true);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentSession, pomodoroTime, breakTime, isBreak, todayCycles]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };



  const getProgress = () => {
    const totalTime = isBreak ? breakTime : pomodoroTime;
    return ((totalTime - currentSession) / totalTime) * 100;
  };

  // 获取扇形角度（基于30分钟制表盘）
  const getSectorAngle = () => {
    const remainingSeconds = currentSession;
    // 将剩余秒数转换为分钟
    const remainingMinutes = remainingSeconds / 60;
    // 30分钟制表盘，每分钟12度 (360° ÷ 30分钟 = 12度/分钟)
    const angle = remainingMinutes * 12;
    return angle;
  };



  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 2,
        flexDirection: { xs: 'column', md: 'row' }, // 移动端垂直布局，桌面端水平布局
        '@media (max-width: 600px)': {
          gap: 0,
          padding: 0.1,
        },
      }}
    >
      {/* 左侧计时器 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 0.2, sm: 1, md: 2 }, // 进一步减少内边距
          maxWidth: { xs: 'calc(100% - 16px)', sm: '380px', md: '400px' }, // 移动端占据更多宽度
          minHeight: { xs: '120px', sm: '150px', md: '170px' }, // 减少时间模块高度
          width: { xs: 'calc(100% - 16px)', md: 'auto' }, // 移动端占据更多宽度
          margin: { xs: '16px 8px 4px 8px', md: '0 16px 0 16px' }, // 进一步减少下边距
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#FFD700',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
            marginBottom: { xs: 1, sm: 1.5, md: 2 }, // 减少时间显示的下边距
            fontFamily: 'monospace',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // 响应式字体大小
          }}
        >
          {formatTime(currentTime)}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFD700',
            textAlign: 'center',
            opacity: 0.9,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }, // 响应式字体大小
            marginBottom: { xs: 0.5, sm: 1, md: 1.5 }, // 减少日期显示的下边距
          }}
        >
          {formatDate(currentTime)}
        </Typography>
        
        {/* 显示修行提示 */}
        {tips.length > 0 && (
          <motion.div
            key={animationKey}
            style={{
              marginTop: window.innerWidth <= 600 ? '6px' : '8px', // 进一步减少修行提示上边距
              maxWidth: '100%',
              padding: window.innerWidth <= 600 ? '5px' : '10px', // 减少内边距
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid #FFD700',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-10, 0, 0, -10],
              transition: {
                duration: 10,
                repeat: 0,
                ease: 'easeInOut',
                times: [0, 0.1, 0.9, 1],
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#FFD700',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '0.85rem', sm: '1rem' }, // 移动端稍小字体
              }}
            >
              {currentTip}
            </Typography>
          </motion.div>
        )}
      </Box>

      {/* 右侧番茄钟 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: { xs: 'calc(100% - 16px)', sm: '380px', md: '400px' }, // 移动端占据更多宽度
          position: 'relative',
          width: { xs: 'calc(100% - 16px)', md: 'auto' }, // 移动端占据更多宽度
          margin: { xs: '-60px 8px 32px 8px', md: '-40px 16px 0 16px' }, // 移动端增加底部空间
        }}
      >
        {/* 番茄钟主体 */}
        <Box
          component={motion.div}
          sx={{
            position: 'relative',
            width: 'min(85%, 300px)',
            height: 'min(85%, 300px)',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
            '@media (max-width: 600px)': {
              width: 'min(85%, 280px)', // 移动端缩小番茄钟表盘
              height: 'min(85%, 280px)',
            },
          }}
          animate={{
            scale: [1, 1.01, 1],
            filter: [
              'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
              'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
              'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          }}
        >
          {/* 背景圆 */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
              border: '3px solid rgba(255, 215, 0, 0.6)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* 桌面装饰背景图 */}
            {desktopDecoration && (
              <Box
                component="img"
                src={desktopDecoration}
                alt="修行圣物"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '70%',
                  height: '70%',
                  objectFit: 'contain',
                  opacity: 0.9, // 进一步提高透明度让图片更清晰
                  filter: 'brightness(1.2) contrast(1.2) saturate(1.2)', // 进一步增强对比度和饱和度
                  zIndex: 1,
                }}
              />
            )}
            
            {/* 轻微遮罩层 */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)',
                zIndex: 2,
              }}
            />
          </Box>
          
          {/* 倒计时扇形 - 祖母绿内环 */}
          <Box
            sx={{
              position: 'absolute',
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: `conic-gradient(
                from 0deg,
                rgba(0, 200, 81, 0.4) 0deg,
                rgba(0, 200, 81, 0.4) ${getSectorAngle()}deg,
                transparent ${getSectorAngle()}deg,
                transparent 360deg
              )`,
              maskImage: 'radial-gradient(circle, transparent 60%, black 65%, black 100%)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 60%, black 65%, black 100%)',
              top: '7.5%',
              left: '7.5%',
              zIndex: 15,
              transition: 'background 0.5s ease-in-out',
              opacity: 1,
              boxShadow: '0 0 15px rgba(0, 200, 81, 0.5)',
            }}
          />
          

          

          

          
          {/* 刻度 */}
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: '2px',
                height: '8%',
                backgroundColor: '#FFD700',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `rotate(${i * 30}deg)`,
                top: '5%',
                opacity: 0.6,
                boxShadow: '0 0 3px rgba(255, 215, 0, 0.5)',
                zIndex: 3, // 降低刻度线层级，让扇形在上方
              }}
            />
          ))}
          
          {/* 数字刻度 - 30分钟制表盘（顺时针显示） */}
          {[
            { num: 0, angle: 0 },     // 12点位置
            { num: 5, angle: 60 },    // 2点位置
            { num: 10, angle: 120 },  // 4点位置
            { num: 15, angle: 180 },  // 6点位置
            { num: 20, angle: 240 },  // 8点位置
            { num: 25, angle: 300 }   // 10点位置
          ].map(({ num, angle }) => (
            <Typography
              key={num}
              sx={{
                position: 'absolute',
                color: '#FFD700',
                fontSize: { xs: '12px', sm: '14px' },
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.9)',
                transform: `rotate(${angle}deg) translate(0, -130px) rotate(${-angle}deg)`,
                transformOrigin: 'center',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                minWidth: '16px',
                textAlign: 'center',
              }}
            >
              {num}
            </Typography>
          ))}
          
          {/* 中心时间显示 */}
          <Typography
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 5px rgba(0, 0, 0, 0.9)',
              zIndex: 20, // 提高时间显示层级，确保在所有元素上方
              userSelect: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // 增加背景透明度提高可读性
              padding: { xs: '6px 12px', sm: '8px 16px' }, // 响应式内边距
              borderRadius: '12px',
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' }, // 增大时间显示字体
            }}
          >
            {formatPomodoroTime(currentSession)}
          </Typography>
        </Box>
        
        {/* 周期计数和控制按钮组合 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 2, sm: 3 }, // 周期计数和按钮之间的间距
            marginTop: { xs: 0.5, sm: 1.5 },
            marginBottom: { xs: 4, sm: 2 },
          }}
        >
          {/* 周期计数 */}
          <Typography
            variant="body1"
            sx={{
              color: '#FFD700',
              textAlign: 'center',
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: { xs: '4px 8px', sm: '8px 16px' },
              borderRadius: '16px',
              border: '1px solid #FFD700',
              maxWidth: { xs: '200px', sm: '250px' },
            }}
          >
            今日完成 {todayCycles} 个周期
          </Typography>
          
          {/* 控制按钮 */}
          <Box
            onClick={toggleTimer}
            sx={{
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              color: '#FFD700',
              border: '3px solid #FFD700',
              borderRadius: '50px', // 圆角长条形
              width: { xs: 180, sm: 220 }, // 增大长条形宽度
              height: { xs: 60, sm: 70 }, // 增大长条形高度
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 2 }, // 增大图标和文字之间的间距
              fontSize: { xs: '1.8rem', sm: '2.2rem' }, // 增大图标尺寸
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              userSelect: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.25)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '18px' }, // 增大文字尺寸
                fontWeight: 'bold',
                color: '#FFD700',
                textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
              }}
            >
              {isRunning ? '暂停' : '开始'}
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
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
  const [viewMode, setViewMode] = useState(() => {
    // 从 localStorage 读取保存的模式，如果没有则使用 'dualtime' 作为默认值
    // 支持的模式: 'easy' | 'dualtime'
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('spiritualPracticeViewMode');
      return savedMode || 'dualtime';
    }
    return 'dualtime';
  });
  const [showMenu, setShowMenu] = useState(false);

  // 切换模式并保存到 localStorage
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spiritualPracticeViewMode', newMode);
    }
  };

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
      {/* 左侧菜单 */}
      {!isFullScreen && (
        <>
          {/* 菜单按钮 */}
          <IconButton
            onClick={() => setShowMenu(!showMenu)}
            sx={{
              position: "fixed",
              top: { xs: 60, sm: 80 }, // 移动端位置稍高
              left: { xs: 10, sm: 20 }, // 移动端稍微靠左
              zIndex: 2001,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#FFD700',
              border: '2px solid #FFD700',
              width: { xs: 40, sm: 48 }, // 响应式大小
              height: { xs: 40, sm: 48 },
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              },
            }}
          >
            {showMenu ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* 菜单面板 */}
          {showMenu && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: window.innerWidth <= 600 ? 110 : 130, // 移动端位置调整
                left: window.innerWidth <= 600 ? 10 : 20, // 移动端稍微靠左
                zIndex: 2000,
                width: window.innerWidth <= 600 ? 160 : 200, // 移动端宽度稍小
              }}
            >
              <Paper
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #FFD700',
                  borderRadius: 2,
                }}
              >
                <List>
                  <ListItem
                    button
                    onClick={() => {
                      handleViewModeChange('easy');
                      setShowMenu(false);
                    }}
                    sx={{
                      backgroundColor: viewMode === 'easy' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary="简单模式"
                      primaryTypographyProps={{
                        color: '#FFD700',
                        fontWeight: viewMode === 'easy' ? 'bold' : 'normal',
                      }}
                    />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => {
                      handleViewModeChange('dualtime');
                      setShowMenu(false);
                    }}
                    sx={{
                      backgroundColor: viewMode === 'dualtime' ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary="DualTime模式"
                      primaryTypographyProps={{
                        color: '#FFD700',
                        fontWeight: viewMode === 'dualtime' ? 'bold' : 'normal',
                      }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </motion.div>
          )}
        </>
      )}

      {/* 右上角全屏按钮 */}
      {isFullScreen === false && (
        <IconButton
          color="primary"
          onClick={() => {
            setIsFullScreen(true);
            goFullScreen();
          }}
          sx={{
            position: "fixed",
            top: { xs: 10, sm: 20 }, // 响应式位置
            right: { xs: 10, sm: 20 }, // 响应式位置
            zIndex: 1000,
            width: { xs: 40, sm: 48 }, // 响应式大小
            height: { xs: 40, sm: 48 },
          }}
        >
          <FullscreenIcon sx={{ 
            fontSize: { xs: 24, sm: 32 }, // 响应式图标大小
            color: "#FFD700" 
          }} />
        </IconButton>
      )}
      {isFullScreen === true && (
        <IconButton
          color="primary"
          onClick={() => {
            setIsFullScreen(false);
            exitFullScreen();
          }}
          sx={{
            position: "fixed",
            top: { xs: 10, sm: 20 }, // 响应式位置
            right: { xs: 10, sm: 20 }, // 响应式位置
            zIndex: 1000,
            width: { xs: 40, sm: 48 }, // 响应式大小
            height: { xs: 40, sm: 48 },
          }}
        >
          <FullscreenExitIcon sx={{ 
            fontSize: { xs: 24, sm: 32 }, // 响应式图标大小
            color: "#FFD700" 
          }} />
        </IconButton>
      )}

      {/* 主要内容区域 */}
      {viewMode === 'easy' ? (
        <>
                      {/* 简单模式：显示提示文本 */}
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

          {/* 简单模式：显示桌面装饰 */}
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
        </>
      ) : (
        /* DualTime模式：显示计时器和表盘 */
        <DualTimeComponent
          desktopDecoration={desktopDecoration}
          tips={tips}
          currentTip={currentTip}
          animationKey={animationKey}
        />
      )}

      {/* 返回按钮 */}
      {isFullScreen === false && (
        <IconButton
          color="primary"
          onClick={() => setSpiritualPractice(false)}
          sx={{
            position: "fixed",
            top: { xs: 10, sm: 20 }, // 响应式位置
            left: { xs: 10, sm: 20 }, // 响应式位置
            zIndex: 2,
            width: { xs: 40, sm: 48 }, // 响应式大小
            height: { xs: 40, sm: 48 },
            boxShadow: "0 2px 8px #FFD70044",
            "&:hover": {
              border: "2px solid #FFD700",
            },
          }}
        >
          <ArrowBackIcon sx={{ 
            fontSize: { xs: 24, sm: 32 }, // 响应式图标大小
            color: "#FFD700" 
          }} />
        </IconButton>
      )}
    </Box>
  );
}

export default SpiritualPracticeView; 