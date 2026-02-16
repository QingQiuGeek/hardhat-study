// Node.js 内置的严格断言模块
import assert from 'node:assert/strict';

// Node.js 20+ 内置的测试框架
import { describe, it } from 'node:test';

// 用于连接 Hardhat 网络并获取 Viem 客户端
import { network } from 'hardhat';

// 使用 describe 定义一个名为 "Counter" 的测试套件
describe('Counter', async function () {
	// Viem 是 TypeScript-first 的 Web3 库，比 Ethers.js 更类型安全、模块化。
	const { viem } = await network.connect();

	// 返回一个 只读客户端，用于查询链上数据（如区块、余额），监听合约事件
	const publicClient = await viem.getPublicClient();

	it('The sum of the Increment events should match the current value', async function () {
		//自动查找 artifacts/contracts/Counter.sol/Counter.json，使用默认 signer 部署合约，返回一个 Viem 合约实例，包含 .write（写）、.read（读）、.abi 等属性
		const counter = await viem.deployContract('Counter');

		//获取部署时的最新区块号，后续用它作为 fromBlock，确保只监听部署之后的事件，避免抓到历史噪音事件
		const deploymentBlockNumber = await publicClient.getBlockNumber();

		// run a series of increments
		for (let i = 1n; i <= 10n; i++) {
			await counter.write.incBy([i]);
		}

		// events 是一个 类型化的数组，每个 event.args.by 是 bigint
		const events = await publicClient.getContractEvents({
			address: counter.address, //合约地址（必填）
			abi: counter.abi, //ABI（必填，用于解析事件）
			eventName: 'Increment', //事件名（可选，不填则返回所有事件）
			fromBlock: deploymentBlockNumber, //起始区块（默认：0n）
			strict: true, //严格模式（ABI 必须完全匹配）
			/**
            toBlock: 456n,  不必填，结束区块（默认：'latest'）
			args: {
                by是Counter.sol中定义的event的参数名
				by: 5n,
				或范围：by: { gt: 3n, lt: 10n }
                或地址：to: aliceAddress (from: aliceAddress)  
			},
             */
		});

		// 0n 是 JavaScript/TypeScript 中表示 BigInt 类型字面量的原生语法，精度整数仅受内存限制，理论上无上限
		let total = 0n;
		// 遍历所有事件，累加 by 字段
		for (const event of events) {
			total += event.args.by;
		}

		assert.equal(total, await counter.read.x());
	});
});
