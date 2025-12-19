import todo from "../models/TODO.js";


/////////////save////////////////
export const saveTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const newTodo = await todo.create({
      title,
      user: req.userId, // comes from JWT middleware
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (err) {
    console.log("Error in saveTodo:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





///////////////delete////////////////////
export const deleteTodo = async(req,res)=>{
    try{
        const {id} = req.params;
        console.log(`id is ${id}`);
        if(!id){
            return res.status(400).json({staus:false,message:"error"});
        }
       const deleted = await todo.findOneAndDelete({ _id: id, user: req.userId });

        if(!deleted){
            return res.status(400).json({status:false,message:"error"});
        }
        return res.status(200).json({status:true,message:"success"})
      
    }catch(err){
        res.status(500).json({success:false,Message:"some error with deleting the todo"});
console.log(`err is in delete is ${err}`)
    }
}




/////////////delete all ////////////////////

export const deleteAllTodo = async(req,res)=>{
    try{
        const result = await todo.deleteMany({ user: req.userId });
        return res.status(200).json({success:true,message: "successfully delete all", deletecount:result.deletedCount})
      
      


    }catch(err){
        return res.status(500).json({success:false,message:"err in catch"});
        console.log(`err is in catch ${err}`);

    }
}


///////////////////update the todo ///////////////

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Todo id is required",
      });
    }

    // build update object dynamically
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const updatedTodo = await todo.findOneAndUpdate(
      { _id: id, user: req.userId },
      updateFields,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(400).json({
        success: false,
        message: "Todo not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });

  } catch (err) {
    console.log("Error in update todo:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating todo",
    });
  }
};

//////////////////////get///////////////////
export const getTodos = async(req, res) => {
  try {
    const todos = await todo.find({ user: req.userId });

    res.status(200).json({ success: true, todos });
  } catch (err) {
    console.log("error in getTodos", err);
    res.status(500).json({ success: false, message: "server error" });
  }
};
