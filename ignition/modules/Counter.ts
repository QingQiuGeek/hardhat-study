import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('CounterModule', (m) => {
	const counter = m.contract('Counter');

	m.call(counter, 'incBy', [5n]);

	return { counter };
});

// 部署命令npx hardhat ignition deploy ignition/modules/Counter.ts
