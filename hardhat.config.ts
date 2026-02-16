import { defineConfig } from 'hardhat/config';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';

export default defineConfig({
	plugins: [hardhatToolboxViemPlugin],
	solidity: {
		version: '0.8.28',
	},
	networks: {
		localhost: {
			url: 'http://127.0.0.1:8545', // ← 必须匹配实际节点地址
			accounts: [
				/* 私钥 */
			], // 可选：指定部署账户
		},
	},
});
