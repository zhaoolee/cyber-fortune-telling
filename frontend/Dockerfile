# 前端生产环境 Dockerfile
FROM node:22.14.0

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 设置npm使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/
# 安装 pnpm
RUN npm install -g pnpm
# 设置npm使用淘宝镜像源
RUN pnpm config set registry https://registry.npmmirror.com/

# 复制 package.json 
COPY package.json ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .


# 构建 Next.js 应用
RUN pnpm run build

# 暴露端口 4000（根据 package.json 中的配置）
EXPOSE 4000

# 启动生产服务器
CMD ["pnpm", "run", "start"]

