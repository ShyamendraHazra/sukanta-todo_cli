#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
const program = new Command();

// get version
function getVersion() {
    const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))
    return pkg.version;
}
const appVersion = getVersion()

// CLI Description
program
    .name(chalk.green('TODO.CLI'))
    .description('A CLI app to manage your TODO List')
    .version(appVersion)

// connect db
const connDb = () => {
    const db = new LowSync(new JSONFileSync('tasks.json'), { tasks: [] })
    db.data ||= { tasks: [] }
    return db;
}

// Add a task
program
    .command('add <task...>')
    .description('add a task to do')
    .action((task) => {
        const db = connDb()
        try{
            db.read();
        } catch(err){
            if(err instanceof SyntaxError) {
                db.data = { tasks: [] };
            } else {
                throw err;
            }
        }
        db.data ||= { tasks: [] };
        const newTask = {
            id: Date.now().toString(36),
            task: task.join(' '),
            completed: false
        };
        db.data.tasks.push(newTask);
        db.write()
        console.log(chalk.green('Added task.'), ` ID: ${newTask.id}`)
    })

// show all tasks
const showAllTasks = (db) => {
        db.read();
        const { tasks } = db.data;
        if(tasks.length === 0){
            console.log(chalk.green('All Clean.'));
            return;
        }
        tasks.forEach((item) => {
            console.log(`${item.completed ? "[X]" : "[ ]"} ${item.task} (${item.id})`)
        })
}
// Update a task
program
    .command("update <taskid>")
    .description('update a task')
    .option('-c, --complete', 'mark task as complete')
    .option('-n, --not-complete', 'mark task as not complete')
    .action(async (taskid, options) => {
        const db = connDb()
        try{
            db.read();
        } catch(err) {
            console.error('Sorry, cannot read the database right now')
            const ans = input({ message: 'Want to see full error? '})
            ans ? console.log(err) : process.exit(1);
            process.exit(1);
        }

        if(options.complete && options.notComplete){
            console.error(chalk.red('Choose either --complete or --not-complete, not both'))
            process.exitCode = 1;
            return;
        }

        const {tasks} = db.data
        const targetIndex = tasks.findIndex((task) => task.id === taskid)

        if(targetIndex === -1) { console.error('Invalid task ID. Try again.'); return;}

        const targetTask = tasks[targetIndex];
        if(options.complete){
            targetTask.completed = true
        }else if(options.notComplete){
            targetTask.completed = false
        }
        let printMessage;
        try{
            const confirmation = await confirm({
                message: "Update task description?",
                default: false
            })
            if(confirmation){ 
                const message = await input({
                message: "Enter new task description",
                default: targetTask.task
            });
            targetTask.task = message
            printMessage = chalk.green('Task updated successfully')

            }else{ 
                printMessage = chalk.blue('Task updated successfully.') 
            }
        }finally{
            db.write();
        }
        console.log(printMessage)
        console.log('Updated Tasks:')
        showAllTasks(db);
    })

// Delete a task
program
    .command('delete <taskid>')
    .description('delete a task')
    .action(async (taskid) => {
        const answer = await confirm({
            message: "Are you sure?",
            default: false
        });
        if(!answer){
            console.log(chalk.blue('Deletion cancelled.'));
            return;
        }
        const db = connDb()
        db.read();
        const { tasks } = db.data
        const targetIndex = tasks.findIndex((task) => task.id === taskid)

        if(targetIndex === -1) {
            console.error(`Task id ${taskid} not found`)
            process.exitCode = 1;
            return;
        }

        const targetTask = tasks[targetIndex];
        if(!targetTask.completed) {
            console.log(chalk.yellow('WARNING: Task was not marked complete'))
        }
        tasks.splice(targetIndex, 1);
        db.write();
        console.log(chalk.red(`Deleted task ${taskid}`))
        showAllTasks(db);
    })


program
    .command('status')
    .description('show all tasks')
    .action(() => {
        const db = connDb()
        showAllTasks(db);
    })

program.parse()
